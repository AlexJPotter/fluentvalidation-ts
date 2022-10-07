import { AsyncValueValidator } from './AsyncValueValidator';
import { AsyncRule } from '../rules/AsyncRule';
import { MustAsyncRule } from '../rules/MustAsyncRule';
import { Rule } from '../rules/Rule';
import { ValueValidationResult } from '../ValueValidationResult';
import { hasError } from './ValueValidator';
import { IAsyncValidator } from '../IAsyncValidator';
import { AsyncValidatorRule } from '../rules/AsyncValidatorRule';
import { CoreValueValidatorBuilder } from './CoreValueValidatorBuilder';
import { ValueTransformer } from './ValueTransformer';

export class AsyncValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue
> extends CoreValueValidatorBuilder<TModel, TValue, TTransformedValue> {
  constructor(
    rebuildValidateAsync: () => void,
    transformValue: ValueTransformer<TValue, TTransformedValue>
  ) {
    super(rebuildValidateAsync, transformValue);
  }

  public build = (): AsyncValueValidator<TModel, TValue, TTransformedValue> => {
    return async (
      value: TValue,
      model: TModel
    ): Promise<ValueValidationResult<TTransformedValue>> => {
      const transformedValue = this.transformValue(value);

      for (const rule of this.rules) {
        const validationResult = rule.isAsync
          ? await (
              rule.rule as AsyncRule<TModel, TTransformedValue>
            ).validateAsync(transformedValue, model)
          : (rule.rule as Rule<TModel, TTransformedValue>).validate(
              transformedValue,
              model
            );

        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  public mustAsync = (
    definition:
      | ((value: TTransformedValue, model: TModel) => Promise<boolean>)
      | {
          predicate: (
            value: TTransformedValue,
            model: TModel
          ) => Promise<boolean>;
          message:
            | string
            | ((value: TTransformedValue, model: TModel) => string);
        }
      | Array<
          | ((value: TTransformedValue, model: TModel) => Promise<boolean>)
          | {
              predicate: (
                value: TTransformedValue,
                model: TModel
              ) => Promise<boolean>;
              message:
                | string
                | ((value: TTransformedValue, model: TModel) => string);
            }
        >
  ) => {
    const asyncMustRule = new MustAsyncRule<TModel, TTransformedValue>(
      definition
    );
    this.pushAsyncRule(asyncMustRule);
    return this.getAllRulesAndExtensions();
  };

  public setAsyncValidator = (
    validatorProducer: (model: TModel) => IAsyncValidator<TTransformedValue>
  ) => {
    const asyncValidatorRule = new AsyncValidatorRule<
      TModel,
      TTransformedValue
    >(
      validatorProducer as (model: TModel) => IAsyncValidator<TTransformedValue>
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
