import { IValidator } from '../IValidator';
import { EmailAddressRule } from '../rules/EmailAddressRule';
import { EqualRule } from '../rules/EqualRule';
import { ExclusiveBetweenRule } from '../rules/ExclusiveBetweenRule';
import { GreaterThanOrEqualToRule } from '../rules/GreaterThanOrEqualToRule';
import { GreaterThanRule } from '../rules/GreaterThanRule';
import { InclusiveBetweenRule } from '../rules/InclusiveBetweenRule';
import { LengthRule } from '../rules/LengthRule';
import { LessThanOrEqualToRule } from '../rules/LessThanOrEqualToRule';
import { LessThanRule } from '../rules/LessThanRule';
import { MatchesRule } from '../rules/MatchesRule';
import { MaxLengthRule } from '../rules/MaxLengthRule';
import { MinLengthRule } from '../rules/MinLengthRule';
import { MustRule } from '../rules/MustRule';
import { NotEmptyRule } from '../rules/NotEmptyRule';
import { NotEqualRule } from '../rules/NotEqualRule';
import { NotNullRule } from '../rules/NotNullRule';
import { NullRule } from '../rules/NullRule';
import { Rule } from '../rules/Rule';
import { ScalePrecisionRule } from '../rules/ScalePrecisionRule';
import { ValidatorRule } from '../rules/ValidatorRule';
import { ValueValidationResult } from '../ValueValidationResult';
import { ValueValidator } from '../ValueValidator';
import { hasError } from './ValueValidator';

export class ValueValidatorBuilder<TModel, TValue> {
  private rules: Array<Rule<TModel, TValue>> = [];
  private rebuildValidate: () => void;

  constructor(rebuildValidate: () => void) {
    this.rebuildValidate = rebuildValidate;
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel): ValueValidationResult<TValue> => {
      for (const rule of this.rules) {
        const validationResult = rule.validate(value, model);
        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  private pushRule = (rule: Rule<TModel, TValue>) => {
    this.rules.push(rule);
    this.rebuildValidate();
  };

  public withMessage = (message: string) => {
    const latestRule = this.getLatestRule();
    latestRule.setCustomErrorMessage(message);
    this.rebuildValidate();
    return {
      ...this.getAllRules(),
      when: this.when,
      unless: this.unless,
    };
  };

  public when = (
    condition: (model: TModel) => boolean,
    appliesTo:
      | 'AppliesToAllValidators'
      | 'AppliesToCurrentValidator' = 'AppliesToAllValidators'
  ) => {
    if (appliesTo === 'AppliesToAllValidators') {
      for (const rule of this.rules) {
        rule.setWhenCondition(condition);
      }
    } else {
      const latestRule = this.getLatestRule();
      latestRule.setWhenCondition(condition);
    }
    this.rebuildValidate();
    return this.getAllRules();
  };

  public unless = (
    condition: (model: TModel) => boolean,
    appliesTo:
      | 'AppliesToAllValidators'
      | 'AppliesToCurrentValidator' = 'AppliesToAllValidators'
  ) => {
    if (appliesTo === 'AppliesToAllValidators') {
      for (const rule of this.rules) {
        rule.setUnlessCondition(condition);
      }
    } else {
      const latestRule = this.getLatestRule();
      latestRule.setUnlessCondition(condition);
    }
    this.rebuildValidate();
    return this.getAllRules();
  };

  public notEqual = (forbiddenValue: TValue) => {
    const notEqualRule = new NotEqualRule<TModel, TValue>(forbiddenValue);
    this.pushRule(notEqualRule);
    return this.getAllRulesAndExtensions();
  };

  public equal = (requiredValue: TValue) => {
    const equalRule = new EqualRule<TModel, TValue>(requiredValue);
    this.pushRule(equalRule);
    return this.getAllRulesAndExtensions();
  };

  public must = (
    definition:
      | ((value: TValue, model: TModel) => boolean)
      | {
          predicate: (value: TValue, model: TModel) => boolean;
          message: string | ((value: TValue, model: TModel) => string);
        }
      | Array<
          | ((value: TValue, model: TModel) => boolean)
          | {
              predicate: (value: TValue, model: TModel) => boolean;
              message: string | ((value: TValue, model: TModel) => string);
            }
        >
  ) => {
    const mustRule = new MustRule<TModel, TValue>(definition);
    this.pushRule(mustRule);
    return this.getAllRulesAndExtensions();
  };

  public notNull = () => {
    const notNullRule = new NotNullRule<TModel, TValue>();
    this.pushRule(notNullRule);
    return this.getAllRulesAndExtensions();
  };

  public null = () => {
    const nullRule = new NullRule<TModel, TValue>();
    this.pushRule(nullRule);
    return this.getAllRulesAndExtensions();
  };

  public notEmpty = () => {
    const notEmptyRule = new NotEmptyRule<TModel, TValue>();
    this.pushRule(notEmptyRule);
    return this.getAllRulesAndExtensions();
  };

  public length = (minLength: number, maxLength: number) => {
    const lengthRule = new LengthRule<TModel, TValue>(minLength, maxLength);
    this.pushRule(lengthRule);
    return this.getAllRulesAndExtensions();
  };

  public maxLength = (maxLength: number) => {
    const maxLengthRule = new MaxLengthRule<TModel, TValue>(maxLength);
    this.pushRule(maxLengthRule);
    return this.getAllRulesAndExtensions();
  };

  public minLength = (minLength: number) => {
    const minLengthRule = new MinLengthRule<TModel, TValue>(minLength);
    this.pushRule(minLengthRule);
    return this.getAllRulesAndExtensions();
  };

  public matches = (pattern: RegExp) => {
    const matchesRule = new MatchesRule<TModel, TValue>(pattern);
    this.pushRule(matchesRule);
    return this.getAllRulesAndExtensions();
  };

  public emailAddress = () => {
    const emailAddressRule = new EmailAddressRule<TModel, TValue>();
    this.pushRule(emailAddressRule);
    return this.getAllRulesAndExtensions();
  };

  public lessThan = (threshold: number) => {
    const lessThanRule = new LessThanRule<TModel, TValue>(threshold);
    this.pushRule(lessThanRule);
    return this.getAllRulesAndExtensions();
  };

  public lessThanOrEqualTo = (threshold: number) => {
    const lessThanOrEqualToRule = new LessThanOrEqualToRule<TModel, TValue>(
      threshold
    );
    this.pushRule(lessThanOrEqualToRule);
    return this.getAllRulesAndExtensions();
  };

  public greaterThan = (threshold: number) => {
    const greaterThanRule = new GreaterThanRule<TModel, TValue>(threshold);
    this.pushRule(greaterThanRule);
    return this.getAllRulesAndExtensions();
  };

  public greaterThanOrEqualTo = (threshold: number) => {
    const greaterThanOrEqualToRule = new GreaterThanOrEqualToRule<
      TModel,
      TValue
    >(threshold);
    this.pushRule(greaterThanOrEqualToRule);
    return this.getAllRulesAndExtensions();
  };

  public exclusiveBetween = (lowerBound: number, upperBound: number) => {
    const exclusiveBetweenRule = new ExclusiveBetweenRule<TModel, TValue>(
      lowerBound,
      upperBound
    );
    this.pushRule(exclusiveBetweenRule);
    return this.getAllRulesAndExtensions();
  };

  public inclusiveBetween = (lowerBound: number, upperBound: number) => {
    const inclusiveBetweenRule = new InclusiveBetweenRule<TModel, TValue>(
      lowerBound,
      upperBound
    );
    this.pushRule(inclusiveBetweenRule);
    return this.getAllRulesAndExtensions();
  };

  public setValidator = (
    validatorProducer: (model: TModel) => IValidator<TValue>
  ) => {
    const validatorRule = new ValidatorRule<TModel, TValue>(
      validatorProducer as (model: TModel) => IValidator<TValue>
    );
    this.pushRule(validatorRule);
    return this.getAllRulesAndExtensions();
  };

  public scalePrecision = (precision: number, scale: number) => {
    if (scale - precision <= 0) {
      throw new Error(
        'Invalid scale and precision were passed to the scalePrecision rule'
      );
    }
    const scalePrecisionRule = new ScalePrecisionRule<TModel, TValue>(
      precision,
      scale
    );
    this.pushRule(scalePrecisionRule);
    return this.getAllRulesAndExtensions();
  };

  public getAllRules = () => {
    return {
      notEqual: this.notEqual,
      equal: this.equal,
      must: this.must,
      notNull: this.notNull,
      null: this.null,
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
      scalePrecision: this.scalePrecision,
    };
  };

  public getAllRulesAndExtensions = () => {
    return {
      ...this.getAllRules(),
      withMessage: this.withMessage,
      when: this.when,
      unless: this.unless,
    };
  };

  private getLatestRule = () => {
    return this.rules[this.rules.length - 1];
  };
}
