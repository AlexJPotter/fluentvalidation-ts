import { AsyncValueValidator } from 'valueValidator/AsyncValueValidator';
import { ValueValidationResult } from '../ValueValidationResult';
import { hasError } from '../valueValidator/ValueValidator';
import { AsyncValueValidatorBuilder } from './AsyncValueValidatorBuilder';

export class AsyncArrayValueValidatorBuilder<
  TModel,
  TPropertyName extends keyof TModel,
  TValue extends Array<TEachValue> & TModel[TPropertyName],
  TEachValue
> {
  private eachAsyncValueValidatorBuilder: AsyncValueValidatorBuilder<
    TModel,
    TValue[0] & TEachValue
  >;

  private propertyName: string;

  constructor(rebuildValidateAsync: () => void, propertyName: string) {
    this.eachAsyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
      TModel,
      TValue[0] & TEachValue
    >(rebuildValidateAsync);

    this.propertyName = propertyName;
  }

  public build = (): AsyncValueValidator<TModel, TValue> => {
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

      return (hasError(errors as ValueValidationResult<TValue>)
        ? errors
        : null) as ValueValidationResult<TValue>;
    };
  };

  public getAllRules = () => this.eachAsyncValueValidatorBuilder.getAllRules();
}
