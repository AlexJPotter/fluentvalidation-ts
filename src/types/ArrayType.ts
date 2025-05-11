export type ArrayType<TEachValue> =
  | Array<TEachValue>
  | ReadonlyArray<TEachValue>
  | Readonly<Array<TEachValue>>;
