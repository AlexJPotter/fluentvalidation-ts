import { AsyncRule } from './AsyncRule';
import { ValueValidationResult } from '@/ValueValidationResult';
import { IAsyncValidator } from '@/IAsyncValidator';

export class AsyncValidatorRule<TModel, TValue> extends AsyncRule<TModel, TValue> {
  constructor(validatorProducer: (model: TModel) => IAsyncValidator<TValue>) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super(async (value: TValue, model: TModel) =>
      value == null
        ? Promise.resolve(null)
        : ((await validatorProducer(model).validateAsync(value)) as ValueValidationResult<TValue>),
    );
  }
}
