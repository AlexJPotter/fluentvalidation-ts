import { ValueTransformer } from './ValueTransformer';
import { hasError } from './ValueValidator';
import { ValueValidatorBuilder } from './ValueValidatorBuilder';
import { ValueValidator } from '@/ValueValidator';
import { ValueValidationResult } from '@/ValueValidationResult';
import { ArrayType } from '@/types/ArrayType';

export class ArrayValueValidatorBuilder<
  TModel,
  TValue extends ArrayType<TEachValue>,
  TEachValue,
  TEachTransformedValue,
> {
  private eachValueValidatorBuilder: ValueValidatorBuilder<
    TModel,
    TEachValue,
    TEachTransformedValue
  >;

  constructor(
    rebuildValidate: () => void,
    transformValue: ValueTransformer<TEachValue, TEachTransformedValue>
  ) {
    this.eachValueValidatorBuilder = new ValueValidatorBuilder<
      TModel,
      TEachValue,
      TEachTransformedValue
    >(rebuildValidate, transformValue);
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel) => {
      if (value == null) {
        return null;
      }

      const valueValidator = this.eachValueValidatorBuilder.build();

      const errors = value.map((element) => {
        const errorOrNull = valueValidator(element, model);
        return hasError(errorOrNull) ? errorOrNull : null;
      }) as ValueValidationResult<TValue>;

      return hasError<TValue>(errors) ? errors : null;
    };
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
