import { ValueTransformer } from './ValueTransformer';
import { IValidator } from '@/IValidator';
import { AsyncRule } from '@/rules/AsyncRule';
import { EmailAddressRule } from '@/rules/EmailAddressRule';
import { EqualRule } from '@/rules/EqualRule';
import { ExclusiveBetweenRule } from '@/rules/ExclusiveBetweenRule';
import { GreaterThanOrEqualToRule } from '@/rules/GreaterThanOrEqualToRule';
import { GreaterThanRule } from '@/rules/GreaterThanRule';
import { InclusiveBetweenRule } from '@/rules/InclusiveBetweenRule';
import { LengthRule } from '@/rules/LengthRule';
import { LessThanOrEqualToRule } from '@/rules/LessThanOrEqualToRule';
import { LessThanRule } from '@/rules/LessThanRule';
import { MatchesRule } from '@/rules/MatchesRule';
import { MaxLengthRule } from '@/rules/MaxLengthRule';
import { MinLengthRule } from '@/rules/MinLengthRule';
import { MustRule } from '@/rules/MustRule';
import { NotEmptyRule } from '@/rules/NotEmptyRule';
import { NotEqualRule } from '@/rules/NotEqualRule';
import { NotNullRule, NotNullRuleOptions } from '@/rules/NotNullRule';
import { NullRule, NullRuleOptions } from '@/rules/NullRule';
import { Rule } from '@/rules/Rule';
import { PrecisionScaleRule } from '@/rules/PrecisionScaleRule';
import { ValidatorRule } from '@/rules/ValidatorRule';
import { Predicate } from '@/types/Predicate';
import { AppliesTo } from '@/types/AppliesTo';
import { RuleValidatorsAndConditionExtensions, WithMessage } from '@/valueValidator/RuleValidators';
import { NotUndefinedRule } from '@/rules/NotUndefinedRule';
import { UndefinedRule } from '@/rules/UndefinedRule';

export abstract class CoreValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue,
  TRuleValidators,
  TRuleValidatorsAndConditionExtensions,
  TRuleValidatorsAndExtensions,
> {
  protected rules: Array<{
    isAsync: boolean;
    rule: Rule<TModel, TTransformedValue> | AsyncRule<TModel, TTransformedValue>;
  }> = [];

  protected numberOfRulesInCurrentConditionChain: number = 0;

  private readonly rebuildValidate: () => void;

  protected transformValue: ValueTransformer<TValue, TTransformedValue>;

  protected constructor(
    rebuildValidate: () => void,
    transformValue: ValueTransformer<TValue, TTransformedValue>,
  ) {
    this.rebuildValidate = rebuildValidate;
    this.transformValue = transformValue;
  }

  protected pushRule = (rule: Rule<TModel, TTransformedValue>) => {
    this.rules.push({ isAsync: false, rule });
    this.numberOfRulesInCurrentConditionChain += 1;
    this.rebuildValidate();
  };

  protected pushAsyncRule = (rule: AsyncRule<TModel, TTransformedValue>) => {
    this.rules.push({ isAsync: true, rule });
    this.numberOfRulesInCurrentConditionChain += 1;
    this.rebuildValidate();
  };

  protected getRulesInCurrentConditionChain = (): Array<{
    isAsync: boolean;
    rule: Rule<TModel, TTransformedValue> | AsyncRule<TModel, TTransformedValue>;
  }> =>
    this.numberOfRulesInCurrentConditionChain === 0
      ? []
      : this.rules.slice(-this.numberOfRulesInCurrentConditionChain);

  protected breakOffCurrentConditionChain = () => (this.numberOfRulesInCurrentConditionChain = 0);

  public withMessage: WithMessage<TModel, TTransformedValue> = (message: string) => {
    const latestRule = this.getLatestRule();
    latestRule.rule.setCustomErrorMessage(message);

    this.rebuildValidate();

    return this.getAllRulesAndConditionExtensions() as RuleValidatorsAndConditionExtensions<
      TModel,
      TTransformedValue
    >;
  };

  public when = (
    condition: (model: TModel) => boolean,
    appliesTo: AppliesTo = 'AppliesToAllValidators',
  ) => {
    if (appliesTo === 'AppliesToAllValidators') {
      for (const rule of this.getRulesInCurrentConditionChain()) {
        rule.rule.setWhenCondition(condition);
      }
    } else {
      const latestRule = this.getLatestRule();
      latestRule.rule.setWhenCondition(condition);
    }
    this.rebuildValidate();
    this.breakOffCurrentConditionChain();
    return this.getAllRules();
  };

  public unless = (
    condition: (model: TModel) => boolean,
    appliesTo: AppliesTo = 'AppliesToAllValidators',
  ) => {
    if (appliesTo === 'AppliesToAllValidators') {
      for (const rule of this.getRulesInCurrentConditionChain()) {
        rule.rule.setUnlessCondition(condition);
      }
    } else {
      const latestRule = this.getLatestRule();
      latestRule.rule.setUnlessCondition(condition);
    }
    this.rebuildValidate();
    this.breakOffCurrentConditionChain();
    return this.getAllRules();
  };

  public notEqual = (forbiddenValue: TTransformedValue) => {
    const notEqualRule = new NotEqualRule<TModel, TTransformedValue>(forbiddenValue);
    this.pushRule(notEqualRule);
    return this.getAllRulesAndExtensions();
  };

  public equal = (requiredValue: TTransformedValue) => {
    const equalRule = new EqualRule<TModel, TTransformedValue>(requiredValue);
    this.pushRule(equalRule);
    return this.getAllRulesAndExtensions();
  };

  public must = (predicate: Predicate<TModel, TTransformedValue>) => {
    const mustRule = new MustRule<TModel, TTransformedValue>(predicate);
    this.pushRule(mustRule);
    return this.getAllRulesAndExtensions();
  };

  public notNull = (ruleOptions: NotNullRuleOptions = { includeUndefined: true }) => {
    const notNullRule = new NotNullRule<TModel, TTransformedValue>(ruleOptions);
    this.pushRule(notNullRule);
    return this.getAllRulesAndExtensions();
  };

  public notUndefined = () => {
    const notUndefinedRule = new NotUndefinedRule<TModel, TTransformedValue>();
    this.pushRule(notUndefinedRule);
    return this.getAllRulesAndExtensions();
  };

  public null = (ruleOptions: NullRuleOptions = { includeUndefined: true }) => {
    const nullRule = new NullRule<TModel, TTransformedValue>(ruleOptions);
    this.pushRule(nullRule);
    return this.getAllRulesAndExtensions();
  };

  public undefined = () => {
    const undefinedRule = new UndefinedRule<TModel, TTransformedValue>();
    this.pushRule(undefinedRule);
    return this.getAllRulesAndExtensions();
  };

  public notEmpty = () => {
    const notEmptyRule = new NotEmptyRule<TModel, TTransformedValue>();
    this.pushRule(notEmptyRule);
    return this.getAllRulesAndExtensions();
  };

  public length = (minLength: number, maxLength: number) => {
    const lengthRule = new LengthRule<TModel, TTransformedValue>(minLength, maxLength);
    this.pushRule(lengthRule);
    return this.getAllRulesAndExtensions();
  };

  public maxLength = (maxLength: number) => {
    const maxLengthRule = new MaxLengthRule<TModel, TTransformedValue>(maxLength);
    this.pushRule(maxLengthRule);
    return this.getAllRulesAndExtensions();
  };

  public minLength = (minLength: number) => {
    const minLengthRule = new MinLengthRule<TModel, TTransformedValue>(minLength);
    this.pushRule(minLengthRule);
    return this.getAllRulesAndExtensions();
  };

  public matches = (pattern: RegExp) => {
    const matchesRule = new MatchesRule<TModel, TTransformedValue>(pattern);
    this.pushRule(matchesRule);
    return this.getAllRulesAndExtensions();
  };

  public emailAddress = () => {
    const emailAddressRule = new EmailAddressRule<TModel, TTransformedValue>();
    this.pushRule(emailAddressRule);
    return this.getAllRulesAndExtensions();
  };

  public lessThan = (threshold: number) => {
    const lessThanRule = new LessThanRule<TModel, TTransformedValue>(threshold);
    this.pushRule(lessThanRule);
    return this.getAllRulesAndExtensions();
  };

  public lessThanOrEqualTo = (threshold: number) => {
    const lessThanOrEqualToRule = new LessThanOrEqualToRule<TModel, TTransformedValue>(threshold);
    this.pushRule(lessThanOrEqualToRule);
    return this.getAllRulesAndExtensions();
  };

  public greaterThan = (threshold: number) => {
    const greaterThanRule = new GreaterThanRule<TModel, TTransformedValue>(threshold);
    this.pushRule(greaterThanRule);
    return this.getAllRulesAndExtensions();
  };

  public greaterThanOrEqualTo = (threshold: number) => {
    const greaterThanOrEqualToRule = new GreaterThanOrEqualToRule<TModel, TTransformedValue>(
      threshold,
    );
    this.pushRule(greaterThanOrEqualToRule);
    return this.getAllRulesAndExtensions();
  };

  public exclusiveBetween = (lowerBound: number, upperBound: number) => {
    const exclusiveBetweenRule = new ExclusiveBetweenRule<TModel, TTransformedValue>(
      lowerBound,
      upperBound,
    );
    this.pushRule(exclusiveBetweenRule);
    return this.getAllRulesAndExtensions();
  };

  public inclusiveBetween = (lowerBound: number, upperBound: number) => {
    const inclusiveBetweenRule = new InclusiveBetweenRule<TModel, TTransformedValue>(
      lowerBound,
      upperBound,
    );
    this.pushRule(inclusiveBetweenRule);
    return this.getAllRulesAndExtensions();
  };

  public setValidator = (validatorProducer: (model: TModel) => IValidator<TTransformedValue>) => {
    const validatorRule = new ValidatorRule<TModel, TTransformedValue>(
      validatorProducer as (model: TModel) => IValidator<TTransformedValue>,
    );
    this.pushRule(validatorRule);
    return this.getAllRulesAndExtensions();
  };

  public precisionScale = (precision: number, scale: number) => {
    if (precision < 1 || scale < 0 || precision < scale) {
      throw new Error('Invalid scale and precision were passed to the precisionScale rule');
    }
    const precisionScaleRule = new PrecisionScaleRule<TModel, TTransformedValue>(precision, scale);
    this.pushRule(precisionScaleRule);
    return this.getAllRulesAndExtensions();
  };

  protected _getAllRules = () => ({
    notEqual: this.notEqual,
    equal: this.equal,
    must: this.must,
    notNull: this.notNull,
    notUndefined: this.notUndefined,
    null: this.null,
    undefined: this.undefined,
    notEmpty: this.notEmpty,
    length: this.length,
    maxLength: this.maxLength,
    minLength: this.minLength,
    matches: this.matches,
    emailAddress: this.emailAddress,
    lessThan: this.lessThan,
    lessThanOrEqualTo: this.lessThanOrEqualTo,
    greaterThan: this.greaterThan,
    greaterThanOrEqualTo: this.greaterThanOrEqualTo,
    exclusiveBetween: this.exclusiveBetween,
    inclusiveBetween: this.inclusiveBetween,
    setValidator: this.setValidator,
    precisionScale: this.precisionScale,
  });

  protected abstract getAllRules: () => TRuleValidators;

  protected abstract getAllRulesAndConditionExtensions: () => TRuleValidatorsAndConditionExtensions;

  protected abstract getAllRulesAndExtensions: () => TRuleValidatorsAndExtensions;

  private getLatestRule = () => {
    return this.rules[this.rules.length - 1];
  };
}
