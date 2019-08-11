export type ValueValidationResult<TValue> =
  | (TValue extends Array<unknown> | object
      ?
          | {
              [propertyName in keyof TValue]?: ValueValidationResult<
                TValue[propertyName]
              >
            }
          | string
          | null
      : string | null)
  | string
  | null;
