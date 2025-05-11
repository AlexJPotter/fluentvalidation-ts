export type IfString<TValue, TOut> = TValue extends string ? TOut : never;
export type IfNumber<TValue, TOut> = TValue extends number ? TOut : never;
export type IfObject<TValue, TOut> = TValue extends object ? TOut : never;
