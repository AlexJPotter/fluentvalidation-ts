import { hasError } from '@/valueValidator/ValueValidator';
import { AsyncPredicate } from '@/types/Predicate';
import { CoreValueValidatorBuilder } from '@/valueValidator/CoreValueValidatorBuilder';
import { ValueTransformer } from '@/valueValidator/ValueTransformer';
import { AsyncValueValidator } from '@/valueValidator/AsyncValueValidator';
import { AsyncRule } from '@/rules/AsyncRule';
import { MustAsyncRule } from '@/rules/MustAsyncRule';
import { Rule } from '@/rules/Rule';
import { ValueValidationResult } from '@/ValueValidationResult';
import { IAsyncValidator } from '@/IAsyncValidator';
import { AsyncValidatorRule } from '@/rules/AsyncValidatorRule';
import { MustAsync, SetValidatorAsync } from '@/valueValidator/ValueValidatorBuilderTypes';
import {
  AsyncRuleValidators,
  AsyncRuleValidatorsAndConditionExtensions,
  AsyncRuleValidatorsAndExtensions,
} from '@/valueValidator/AsyncRuleValidators';

export class AsyncValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue,
> extends CoreValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue,
  AsyncRuleValidators<TModel, TTransformedValue>,
  AsyncRuleValidatorsAndConditionExtensions<TModel, TTransformedValue>,
  AsyncRuleValidatorsAndExtensions<TModel, TTransformedValue>
> {
  constructor(
    rebuildValidateAsync: () => void,
    transformValue: ValueTransformer<TValue, TTransformedValue>,
  ) {
    super(rebuildValidateAsync, transformValue);
  }

  public build = (): AsyncValueValidator<TModel, TValue> => {
    return async (value: TValue, model: TModel): Promise<ValueValidationResult<TValue>> => {
      const transformedValue = this.transformValue(value);

      for (const rule of this.rules) {
        const validationResult = rule.isAsync
          ? ((await (rule.rule as AsyncRule<TModel, TTransformedValue>).validateAsync(
              transformedValue,
              model,
            )) as ValueValidationResult<TValue>)
          : ((rule.rule as Rule<TModel, TTransformedValue>).validate(
              transformedValue,
              model,
            ) as ValueValidationResult<TValue>);

        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  public mustAsync: MustAsync<TModel, TTransformedValue> = (
    predicate: AsyncPredicate<TModel, TTransformedValue>,
  ) => {
    const asyncMustRule = new MustAsyncRule<TModel, TTransformedValue>(predicate);
    this.pushAsyncRule(asyncMustRule);
    return this.getAllRulesAndExtensions();
  };

  public setAsyncValidator: SetValidatorAsync<TModel, TTransformedValue> = (
    validatorProducer: (model: TModel) => IAsyncValidator<TTransformedValue>,
  ) => {
    const asyncValidatorRule = new AsyncValidatorRule<TModel, TTransformedValue>(
      validatorProducer as (model: TModel) => IAsyncValidator<TTransformedValue>,
    );
    this.pushAsyncRule(asyncValidatorRule);
    return this.getAllRulesAndExtensions();
  };

  public getAllRules = () =>
    ({
      ...this._getAllRules(),
      mustAsync: this.mustAsync,
      setAsyncValidator: this.setAsyncValidator,
    }) as AsyncRuleValidators<TModel, TTransformedValue>;

  public getAllRulesAndConditionExtensions = () =>
    ({
      ...this.getAllRules(),
      when: this.when,
      unless: this.unless,
    }) as AsyncRuleValidatorsAndConditionExtensions<TModel, TTransformedValue>;

  public getAllRulesAndExtensions = () =>
    ({
      ...this.getAllRulesAndConditionExtensions(),
      withMessage: this.withMessage,
    }) as AsyncRuleValidatorsAndExtensions<TModel, TTransformedValue>;
}
