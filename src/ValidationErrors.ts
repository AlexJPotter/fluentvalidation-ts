import { ValueValidationResult } from './ValueValidationResult';

export type ValidationErrors<TModel> = {
  [propertyName in keyof TModel]?: ValueValidationResult<TModel[propertyName]>;
};
