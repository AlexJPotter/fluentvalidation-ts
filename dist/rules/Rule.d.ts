import { ValueValidationResult } from '../ValueValidationResult';
import { ValueValidator } from '../ValueValidator';
export declare class Rule<TModel, TValue extends TModel[keyof TModel]> {
    private customErrorMessage?;
    private whenCondition?;
    private unlessCondition?;
    private readonly valueValidator;
    constructor(valueValidator: ValueValidator<TModel, TValue>);
    setCustomErrorMessage: (customErrorMessage: string) => void;
    setWhenCondition: (condition: (model: TModel) => boolean) => void;
    setUnlessCondition: (condition: (model: TModel) => boolean) => void;
    validate: (value: TValue, model: TModel) => ValueValidationResult<TValue>;
}
