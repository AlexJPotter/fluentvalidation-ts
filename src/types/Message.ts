export type Message<TModel, TTransformedValue> =
  | string
  | ((value: TTransformedValue, model: TModel) => string);
