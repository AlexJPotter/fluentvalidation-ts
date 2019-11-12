import { IValidator } from '../IValidator';
import { ValueValidationResult } from '../ValueValidationResult';
import { Rule } from './Rule';

export class ValidatorRule<
  TModel,
  TValue extends TModel[keyof TModel]
> extends Rule<TModel, TValue> {
  constructor(validatorProducer: (model: TModel) => IValidator<TValue>) {
    super((value: TValue, model: TModel) =>
      value == null
        ? null
        : (validatorProducer(model).validate(value) as ValueValidationResult<
            TValue
          >)
    );
  }
}
