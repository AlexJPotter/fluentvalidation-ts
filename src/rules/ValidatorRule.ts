import { Rule } from './Rule';
import { IValidator } from '@/IValidator';
import { ValueValidationResult } from '@/ValueValidationResult';

export class ValidatorRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(validatorProducer: (model: TModel) => IValidator<TValue>) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue, model: TModel) =>
      value == null
        ? null
        : (validatorProducer(model).validate(
            value
          ) as ValueValidationResult<TValue>)
    );
  }
}
