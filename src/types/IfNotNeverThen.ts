export type IfNotNeverThen<TValue, TOut> = TValue extends never ? never : TOut;
