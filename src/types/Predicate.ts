import { Message } from '@/types/Message';

export type SimplePredicate<TModel, TTransformedValue> = (
  value: TTransformedValue,
  model: TModel
) => boolean;

export type SimpleAsyncPredicate<TModel, TTransformedValue> = (
  value: TTransformedValue,
  model: TModel
) => Promise<boolean>;

export type SimplePredicateWithMessage<TModel, TTransformedValue> = {
  predicate: SimplePredicate<TModel, TTransformedValue>;
  message: Message<TModel, TTransformedValue>;
};

export type SimpleAsyncPredicateWithMessage<TModel, TTransformedValue> = {
  predicate: SimpleAsyncPredicate<TModel, TTransformedValue>;
  message: Message<TModel, TTransformedValue>;
};

export type Predicate<TModel, TTransformedValue> =
  | SimplePredicate<TModel, TTransformedValue>
  | SimplePredicateWithMessage<TModel, TTransformedValue>
  | Array<
      | SimplePredicate<TModel, TTransformedValue>
      | SimplePredicateWithMessage<TModel, TTransformedValue>
    >;

export type AsyncPredicate<TModel, TTransformedValue> =
  | SimpleAsyncPredicate<TModel, TTransformedValue>
  | SimpleAsyncPredicateWithMessage<TModel, TTransformedValue>
  | Array<
      | SimpleAsyncPredicate<TModel, TTransformedValue>
      | SimpleAsyncPredicateWithMessage<TModel, TTransformedValue>
    >;
