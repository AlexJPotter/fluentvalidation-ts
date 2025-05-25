import { AppliesTo } from '@/types/AppliesTo';
import { AsyncPredicate, Predicate } from '@/types/Predicate';
import { IValidator } from '@/IValidator';
import { IAsyncValidator } from '@/IAsyncValidator';
import { IfNumber, IfObject, IfString } from '@/types/IfType';

export type AsyncRuleValidators<TModel, TValue> = {
  notEqual: (forbiddenValue: TValue) => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  equal: (requiredValue: TValue) => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  must: (predicate: Predicate<TModel, TValue>) => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  mustAsync: (
    predicate: AsyncPredicate<TModel, TValue>,
  ) => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  notNull: () => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  null: () => AsyncRuleValidatorsAndExtensions<TModel, TValue>;
  notEmpty: IfString<TValue, () => AsyncRuleValidatorsAndExtensions<TModel, TValue>>;
  length: IfString<
    TValue,
    (minLength: number, maxLength: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  maxLength: IfString<
    TValue,
    (maxLength: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  minLength: IfString<
    TValue,
    (minLength: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  matches: IfString<TValue, (pattern: RegExp) => AsyncRuleValidatorsAndExtensions<TModel, TValue>>;
  emailAddress: IfString<TValue, () => AsyncRuleValidatorsAndExtensions<TModel, TValue>>;
  lessThan: IfNumber<
    TValue,
    (threshold: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  lessThanOrEqualTo: IfNumber<
    TValue,
    (threshold: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  greaterThan: IfNumber<
    TValue,
    (threshold: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  greaterThanOrEqualTo: IfNumber<
    TValue,
    (threshold: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  exclusiveBetween: IfNumber<
    TValue,
    (lowerBound: number, upperBound: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  inclusiveBetween: IfNumber<
    TValue,
    (lowerBound: number, upperBound: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  scalePrecision: IfNumber<
    TValue,
    (precision: number, scale: number) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  setValidator: IfObject<
    TValue,
    (
      validatorProducer: (model: TModel) => IValidator<NonNullable<TValue>>,
    ) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
  setAsyncValidator: IfObject<
    TValue,
    (
      validatorProducer: (model: TModel) => IAsyncValidator<NonNullable<TValue>>,
    ) => AsyncRuleValidatorsAndExtensions<TModel, TValue>
  >;
};

export type AsyncWhenCondition<TModel, TValue> = (
  condition: (model: TModel) => boolean,
  appliesTo?: AppliesTo,
) => AsyncRuleValidators<TModel, TValue>;

export type AsyncUnlessCondition<TModel, TValue> = (
  condition: (model: TModel) => boolean,
  appliesTo?: AppliesTo,
) => AsyncRuleValidators<TModel, TValue>;

export type AsyncRuleValidatorsAndConditionExtensions<TModel, TValue> = AsyncRuleValidators<
  TModel,
  TValue
> & {
  when: AsyncWhenCondition<TModel, TValue>;
  unless: AsyncUnlessCondition<TModel, TValue>;
};

export type AsyncWithMessage<TModel, TValue> = (
  message: string,
) => AsyncRuleValidatorsAndConditionExtensions<TModel, TValue>;

export type AsyncRuleValidatorsAndExtensions<TModel, TValue> =
  AsyncRuleValidatorsAndConditionExtensions<TModel, TValue> & {
    withMessage: AsyncWithMessage<TModel, TValue>;
  };
