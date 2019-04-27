import { IValidator } from '../IValidator';
import { Rule } from './Rule';
export declare class ValidatorRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(validatorProducer: () => IValidator<TValue>);
}
