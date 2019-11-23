import { ValueValidationResult } from '../ValueValidationResult';
import { ValueValidator } from '../ValueValidator';

export class Rule<TModel, TValue> {
  protected customErrorMessage?: string;
  private whenCondition?: (model: TModel) => boolean;
  private unlessCondition?: (model: TModel) => boolean;
  private readonly valueValidator: ValueValidator<TModel, TValue>;

  constructor(valueValidator: ValueValidator<TModel, TValue>) {
    this.valueValidator = valueValidator;
  }

  public setCustomErrorMessage = (customErrorMessage: string): void => {
    this.customErrorMessage = customErrorMessage;
  };

  public setWhenCondition = (condition: (model: TModel) => boolean) => {
    this.whenCondition = condition;
  };

  public setUnlessCondition = (condition: (model: TModel) => boolean) => {
    this.unlessCondition = condition;
  };

  public validate = (
    value: TValue,
    model: TModel
  ): ValueValidationResult<TValue> => {
    if (this.whenCondition != null && !this.whenCondition(model)) {
      return null;
    }

    if (this.unlessCondition != null && this.unlessCondition(model)) {
      return null;
    }

    const errorOrNull = this.valueValidator(value, model);
    return errorOrNull != null ? this.customErrorMessage || errorOrNull : null;
  };
}
