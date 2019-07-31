import { ValueValidationResult } from './ValueValidationResult';
export declare type ValidationErrors<TModel> = {
    [propertyName in keyof TModel]?: ValueValidationResult<TModel[propertyName]>;
};
