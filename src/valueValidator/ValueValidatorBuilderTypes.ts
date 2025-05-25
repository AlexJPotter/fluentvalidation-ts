import { AsyncPredicate, Predicate } from '@/types/Predicate';
import { IAsyncValidator } from '@/IAsyncValidator';
import { RuleValidatorsAndExtensions } from '@/valueValidator/RuleValidators';

export type Must<TModel, TValue> = (
  predicate: Predicate<TModel, TValue>,
) => RuleValidatorsAndExtensions<TModel, TValue>;

export type Matches<TModel, TValue> = (
  pattern: RegExp,
) => RuleValidatorsAndExtensions<TModel, TValue>;

export type MustAsync<TModel, TValue> = (
  predicate: AsyncPredicate<TModel, TValue>,
) => RuleValidatorsAndExtensions<TModel, TValue>;

export type SetValidatorAsync<TModel, TValue> = (
  validatorProducer: (model: TModel) => IAsyncValidator<TValue>,
) => RuleValidatorsAndExtensions<TModel, TValue>;
