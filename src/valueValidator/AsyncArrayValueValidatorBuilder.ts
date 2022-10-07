import { AsyncValueValidator } from 'valueValidator/AsyncValueValidator';
import { ValueValidationResult } from '../ValueValidationResult';
import { hasError } from '../valueValidator/ValueValidator';
import { AsyncValueValidatorBuilder } from './AsyncValueValidatorBuilder';
import { ValueTransformer } from './ValueTransformer';

export class AsyncArrayValueValidatorBuilder<
  TModel,
  TPropertyName extends keyof TModel,
  TValue extends Array<TEachValue> & TModel[TPropertyName],
  TEachValue,
  TEachTransformedValue
> {
  private eachAsyncValueValidatorBuilder: AsyncValueValidatorBuilder<
    TModel,
    TValue[0] & TEachValue,
    TEachTransformedValue
  >;

  private propertyName: string;

  constructor(
    rebuildValidateAsync: () => void,
    propertyName: string,
    transformValue: ValueTransformer<TEachValue, TEachTransformedValue>
  ) {
    this.eachAsyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
      TModel,
      TValue[0] & TEachValue,
      TEachTransformedValue
    >(rebuildValidateAsync, transformValue);

    this.propertyName = propertyName;
  }

  public build = (): AsyncValueValidator<
    TModel,
    TValue,
    Array<TEachTransformedValue>
  > => {
    return async (value: TValue, model: TModel) => {
      if (model[this.propertyName as TPropertyName] == null) {
        return null;
      }

      const asyncValueValidator = this.eachAsyncValueValidatorBuilder.build();

      const errors = [];

      for (const element of value) {
        const errorOrNull = await asyncValueValidator(element, model);
        const valueValidationResult = hasError(errorOrNull)
          ? errorOrNull
          : null;
        errors.push(valueValidationResult);
      }

      return (
        hasError<Array<TEachTransformedValue>>(
          errors as ValueValidationResult<Array<TEachTransformedValue>>
        )
          ? errors
          : null
      ) as ValueValidationResult<Array<TEachTransformedValue>>;
    };
  };

  public getAllRules = () => this.eachAsyncValueValidatorBuilder.getAllRules();
}
