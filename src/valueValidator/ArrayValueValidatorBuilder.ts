import { ValueValidationResult } from '../ValueValidationResult';
import { ValueValidator } from '../ValueValidator';
import { hasError } from './ValueValidator';
import { ValueValidatorBuilder } from './ValueValidatorBuilder';

export class ArrayValueValidatorBuilder<
  TModel,
  TPropertyName extends keyof TModel,
  TValue extends Array<TEachValue> & TModel[TPropertyName],
  TEachValue
> {
  private eachValueValidatorBuilder: ValueValidatorBuilder<
    TValue,
    number,
    TValue[0] & TEachValue
  >;

  constructor(rebuildValidate: () => void) {
    this.eachValueValidatorBuilder = new ValueValidatorBuilder<
      TValue,
      number,
      TValue[0] & TEachValue
    >(rebuildValidate);
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue) => {
      if (value == null) {
        return null;
      }

      const valueValidator = this.eachValueValidatorBuilder.build();
      const errors = {} as ValueValidationResult<TValue>;

      for (let index = 0; index < value.length; index++) {
        const errorOrNull = valueValidator(value[index] as TValue[0], value);
        if (hasError(errorOrNull)) {
          (errors as any)[index] = errorOrNull;
        }
      }

      return hasError(errors) ? errors : null;
    };
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
