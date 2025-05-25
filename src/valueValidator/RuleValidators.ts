import { AppliesTo } from '@/types/AppliesTo';
import { Predicate } from '@/types/Predicate';
import { IValidator } from '@/IValidator';
import { IfNumber, IfObject, IfString } from '@/types/IfType';
import { NotNullRuleOptions } from '@/rules/NotNullRule';
import { NullRuleOptions } from '@/rules/NullRule';

export type RuleValidators<TModel, TValue> = {
  notEqual: (forbiddenValue: TValue) => RuleValidatorsAndExtensions<TModel, TValue>;
  equal: (requiredValue: TValue) => RuleValidatorsAndExtensions<TModel, TValue>;
  must: (predicate: Predicate<TModel, TValue>) => RuleValidatorsAndExtensions<TModel, TValue>;
  notNull: (options?: NotNullRuleOptions) => RuleValidatorsAndExtensions<TModel, TValue>;
  notUndefined: () => RuleValidatorsAndExtensions<TModel, TValue>;
  null: (ruleOptions?: NullRuleOptions) => RuleValidatorsAndExtensions<TModel, TValue>;
  undefined: () => RuleValidatorsAndExtensions<TModel, TValue>;
  notEmpty: IfString<TValue, () => RuleValidatorsAndExtensions<TModel, TValue>>;
  length: IfString<
    TValue,
    (minLength: number, maxLength: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  maxLength: IfString<TValue, (maxLength: number) => RuleValidatorsAndExtensions<TModel, TValue>>;
  minLength: IfString<TValue, (minLength: number) => RuleValidatorsAndExtensions<TModel, TValue>>;
  matches: IfString<TValue, (pattern: RegExp) => RuleValidatorsAndExtensions<TModel, TValue>>;
  emailAddress: IfString<TValue, () => RuleValidatorsAndExtensions<TModel, TValue>>;
  lessThan: IfNumber<TValue, (threshold: number) => RuleValidatorsAndExtensions<TModel, TValue>>;
  lessThanOrEqualTo: IfNumber<
    TValue,
    (threshold: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  greaterThan: IfNumber<TValue, (threshold: number) => RuleValidatorsAndExtensions<TModel, TValue>>;
  greaterThanOrEqualTo: IfNumber<
    TValue,
    (threshold: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  exclusiveBetween: IfNumber<
    TValue,
    (lowerBound: number, upperBound: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  inclusiveBetween: IfNumber<
    TValue,
    (lowerBound: number, upperBound: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  precisionScale: IfNumber<
    TValue,
    (precision: number, scale: number) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
  setValidator: IfObject<
    TValue,
    (
      validatorProducer: (model: TModel) => IValidator<NonNullable<TValue>>,
    ) => RuleValidatorsAndExtensions<TModel, TValue>
  >;
};

export type WhenCondition<TModel, TValue> = (
  condition: (model: TModel) => boolean,
  appliesTo?: AppliesTo,
) => RuleValidators<TModel, TValue>;

export type UnlessCondition<TModel, TValue> = (
  condition: (model: TModel) => boolean,
  appliesTo?: AppliesTo,
) => RuleValidators<TModel, TValue>;

export type RuleValidatorsAndConditionExtensions<TModel, TValue> = RuleValidators<
  TModel,
  TValue
> & {
  when: WhenCondition<TModel, TValue>;
  unless: UnlessCondition<TModel, TValue>;
};

export type WithMessage<TModel, TValue> = (
  message: string,
) => RuleValidatorsAndConditionExtensions<TModel, TValue>;

export type RuleValidatorsAndExtensions<TModel, TValue> = RuleValidatorsAndConditionExtensions<
  TModel,
  TValue
> & {
  withMessage: WithMessage<TModel, TValue>;
};
