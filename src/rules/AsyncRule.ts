import { CoreRule } from './CoreRule';
import { AsyncValueValidator } from 'valueValidator/AsyncValueValidator';
import { ValueValidationResult } from '../ValueValidationResult';

export class AsyncRule<TModel, TValue> extends CoreRule<TModel> {
  private readonly asyncValueValidator: AsyncValueValidator<TModel, TValue>;

  constructor(asyncValueValidator: AsyncValueValidator<TModel, TValue>) {
    super();
    this.asyncValueValidator = asyncValueValidator;
  }

  public validateAsync = async (
    value: TValue,
    model: TModel
  ): Promise<ValueValidationResult<TValue>> => {
    if (this.whenCondition != null && !this.whenCondition(model)) {
      return null;
    }

    if (this.unlessCondition != null && this.unlessCondition(model)) {
      return null;
    }

    const errorOrNull = await this.asyncValueValidator(value, model);
    return errorOrNull != null ? this.customErrorMessage || errorOrNull : null;
  };
}
