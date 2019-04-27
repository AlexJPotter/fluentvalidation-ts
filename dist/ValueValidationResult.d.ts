export declare type ValueValidationResult<TValue> = (TValue extends Array<infer TEachValue> | object ? {
    [propertyName in keyof TValue]?: ValueValidationResult<TValue[propertyName]>;
} | string | null : string | null) | string | null;
