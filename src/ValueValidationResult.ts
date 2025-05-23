import { ArrayType } from '@/types/ArrayType';

export type ValueValidationResult<TValue> =
  | (TValue extends ArrayType<infer TEachValue>
      ? Array<ValueValidationResult<TEachValue>> | string | null
      : TValue extends object
        ?
            | {
                [propertyName in keyof TValue]?: ValueValidationResult<
                  TValue[propertyName]
                >;
              }
            | string
            | null
        : string | null)
  | string
  | null;
