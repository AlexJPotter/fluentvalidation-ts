import { AsyncValueValidator } from './AsyncValueValidator';
import { AsyncRule } from '../rules/AsyncRule';
import { MustAsyncRule } from '../rules/MustAsyncRule';
import { Rule } from '../rules/Rule';
import { ValueValidationResult } from '../ValueValidationResult';
import { hasError } from './ValueValidator';
import { IAsyncValidator } from '../IAsyncValidator';
import { AsyncValidatorRule } from '../rules/AsyncValidatorRule';
import { CoreValueValidatorBuilder } from './CoreValueValidatorBuilder';

export class AsyncValueValidatorBuilder<
  TModel,
  TValue
> extends CoreValueValidatorBuilder<TModel, TValue> {
  constructor(rebuildValidateAsync: () => void) {
    super(rebuildValidateAsync);
  }

  public build = (): AsyncValueValidator<TModel, TValue> => {
    return async (
      value: TValue,
      model: TModel
    ): Promise<ValueValidationResult<TValue>> => {
      for (const rule of this.rules) {
        const validationResult = rule.isAsync
          ? await (rule.rule as AsyncRule<TModel, TValue>).validateAsync(
              value,
              model
            )
          : (rule.rule as Rule<TModel, TValue>).validate(value, model);

        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  public mustAsync = (
    definition:
      | ((value: TValue, model: TModel) => Promise<boolean>)
      | {
          predicate: (value: TValue, model: TModel) => Promise<boolean>;
          message: string | ((value: TValue, model: TModel) => string);
        }
      | Array<
          | ((value: TValue, model: TModel) => Promise<boolean>)
          | {
              predicate: (value: TValue, model: TModel) => Promise<boolean>;
              message: string | ((value: TValue, model: TModel) => string);
            }
        >
  ) => {
    const asyncMustRule = new MustAsyncRule<TModel, TValue>(definition);
    this.pushAsyncRule(asyncMustRule);
    return this.getAllRulesAndExtensions();
  };

  public setAsyncValidator = (
    validatorProducer: (model: TModel) => IAsyncValidator<TValue>
  ) => {
    const asyncValidatorRule = new AsyncValidatorRule<TModel, TValue>(
      validatorProducer as (model: TModel) => IAsyncValidator<TValue>
    );
    this.pushAsyncRule(asyncValidatorRule);
    return this.getAllRulesAndExtensions();
  };

  public getAllRules = () => {
    return {
      ...this._getAllRules(),
      mustAsync: this.mustAsync,
      setAsyncValidator: this.setAsyncValidator,
    };
  };
}
