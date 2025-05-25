import { ValueValidationResult } from '@/ValueValidationResult';

export type AsyncValueValidator<TModel, TValue> = (
  value: TValue,
  model: TModel,
) => Promise<ValueValidationResult<TValue>>;
