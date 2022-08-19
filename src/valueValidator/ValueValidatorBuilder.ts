import { Rule } from '../rules/Rule';
import { ValueValidationResult } from '../ValueValidationResult';
import { hasError } from './ValueValidator';
import { ValueValidator } from '../ValueValidator';
import { CoreValueValidatorBuilder } from './CoreValueValidatorBuilder';

export class ValueValidatorBuilder<
  TModel,
  TValue
> extends CoreValueValidatorBuilder<TModel, TValue> {
  constructor(rebuildValidate: () => void) {
    super(rebuildValidate);
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel): ValueValidationResult<TValue> => {
      for (const rule of this.rules) {
        const validationResult = (rule.rule as Rule<TModel, TValue>).validate(
          value,
          model
        );

        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  public getAllRules = () => {
    return {
      ...this._getAllRules(),
    };
  };
}
