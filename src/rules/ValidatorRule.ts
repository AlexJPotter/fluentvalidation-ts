import { IValidator } from '../IValidator';
import { ValueValidationResult } from '../ValueValidationResult';
import { Rule } from './Rule';

export class ValidatorRule<
  TModel,
  TValue extends TModel[keyof TModel]
> extends Rule<TModel, TValue> {
  constructor(validatorProducer: () => IValidator<TValue>) {
    super((value: TValue) =>
      value == null
        ? null
        : (validatorProducer().validate(value) as ValueValidationResult<TValue>)
    );
  }
}
