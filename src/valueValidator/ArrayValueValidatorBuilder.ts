import { ValueTransformer } from './ValueTransformer';
import { hasError } from './ValueValidator';
import { ValueValidatorBuilder } from './ValueValidatorBuilder';
import { ValueValidator } from '@/ValueValidator';
import { ValueValidationResult } from '@/ValueValidationResult';

export class ArrayValueValidatorBuilder<
  TModel,
  TPropertyName extends keyof TModel,
  TValue extends Array<TEachValue> & TModel[TPropertyName],
  TEachValue,
  TEachTransformedValue extends
    | TEachValue
    | string
    | number
    | boolean
    | null
    | undefined
    | symbol,
> {
  private eachValueValidatorBuilder: ValueValidatorBuilder<
    TModel,
    TEachValue,
    TEachTransformedValue
  >;

  private propertyName: string;

  constructor(
    rebuildValidate: () => void,
    propertyName: string,
    transformValue: ValueTransformer<TEachValue, TEachTransformedValue>
  ) {
    this.eachValueValidatorBuilder = new ValueValidatorBuilder<
      TModel,
      TEachValue,
      TEachTransformedValue
    >(rebuildValidate, transformValue);

    this.propertyName = propertyName;
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel) => {
      if (value == null || model[this.propertyName as TPropertyName] == null) {
        return null;
      }

      const valueValidator = this.eachValueValidatorBuilder.build();

      const errors = (value as Array<TEachValue>).map((element) => {
        const errorOrNull = valueValidator(element, model);
        return hasError(errorOrNull) ? errorOrNull : null;
      }) as ValueValidationResult<TValue>;

      return hasError<TValue>(errors) ? errors : null;
    };
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
