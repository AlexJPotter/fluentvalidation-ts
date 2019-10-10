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

      const errors = value.map(element => {
        const errorOrNull = valueValidator(element, value);
        return hasError(errorOrNull) ? errorOrNull : null;
      }) as ValueValidationResult<TValue>;

      return hasError(errors) ? errors : null;
    };
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
