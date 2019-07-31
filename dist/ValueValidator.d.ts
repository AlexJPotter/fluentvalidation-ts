import { ValueValidationResult } from './ValueValidationResult';
export declare type ValueValidator<TModel, TValue extends TModel[keyof TModel]> = (value: TValue, model: TModel) => ValueValidationResult<TValue>;
