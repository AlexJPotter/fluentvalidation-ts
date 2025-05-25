type MessageGenerator<TModel, TTransformedValue> = (
  value: TTransformedValue,
  model: TModel,
) => string;

export type Message<TModel, TTransformedValue> =
  | string
  | MessageGenerator<TModel, TTransformedValue>;
