import { AsyncValueValidator } from './AsyncValueValidator';
import { AsyncValueValidatorBuilder } from './AsyncValueValidatorBuilder';
import { ValueTransformer } from './ValueTransformer';
import { ValueValidationResult } from '@/ValueValidationResult';
import { hasError } from '@/valueValidator/ValueValidator';
import { ArrayType } from '@/types/ArrayType';

export class AsyncArrayValueValidatorBuilder<
  TModel,
  TValue extends ArrayType<TEachValue>,
  TEachValue,
  TEachTransformedValue,
> {
  private eachAsyncValueValidatorBuilder: AsyncValueValidatorBuilder<
    TModel,
    TEachValue,
    TEachTransformedValue
  >;

  constructor(
    rebuildValidateAsync: () => void,
    transformValue: ValueTransformer<TEachValue, TEachTransformedValue>,
  ) {
    this.eachAsyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
      TModel,
      TEachValue,
      TEachTransformedValue
    >(rebuildValidateAsync, transformValue);
  }

  public build = (): AsyncValueValidator<TModel, TValue> => {
    return async (value: TValue, model: TModel) => {
      if (value == null) {
        return null;
      }

      const asyncValueValidator = this.eachAsyncValueValidatorBuilder.build();

      const errors = [] as Array<ValueValidationResult<TEachValue>>;

      for (const element of value) {
        const errorOrNull = await asyncValueValidator(element, model);
        const valueValidationResult = hasError(errorOrNull) ? errorOrNull : null;
        errors.push(valueValidationResult);
      }

      return hasError<TValue>(errors as ValueValidationResult<TValue>)
        ? (errors as ValueValidationResult<TValue>)
        : null;
    };
  };

  public getAllRules = () => this.eachAsyncValueValidatorBuilder.getAllRules();
}
