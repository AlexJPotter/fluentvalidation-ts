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
    TModel,
    TValue[0] & TEachValue
  >;

  private propertyName: string;

  constructor(rebuildValidate: () => void, propertyName: string) {
    this.eachValueValidatorBuilder = new ValueValidatorBuilder<
      TModel,
      TValue[0] & TEachValue
    >(rebuildValidate);

    this.propertyName = propertyName;
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel) => {
      if (model[this.propertyName as TPropertyName] == null) {
        return null;
      }

      const valueValidator = this.eachValueValidatorBuilder.build();

      const errors = value.map((element) => {
        const errorOrNull = valueValidator(element, model);
        return hasError(errorOrNull) ? errorOrNull : null;
      }) as ValueValidationResult<TValue>;

      return hasError(errors) ? errors : null;
    };
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
