import { ValueValidationResult } from './ValueValidationResult';

export type ValueValidator<TModel, TValue extends TModel[keyof TModel]> = (
  value: TValue,
  model: TModel
) => ValueValidationResult<TValue>;
