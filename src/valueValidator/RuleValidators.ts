import {
  AsyncBaseValueValidators,
  BaseValueValidators,
  NumberValueValidators,
  ObjectValueValidators,
  StringValueValidators,
} from './ValueValidator';

export type RuleValidators<TModel, TValue> = BaseValueValidators<
  TModel,
  TValue
> &
  (TValue extends string | null | undefined
    ? StringValueValidators<TModel, TValue>
    : {}) &
  (TValue extends number | null | undefined
    ? NumberValueValidators<TModel, TValue>
    : {}) &
  (TValue extends object | null | undefined
    ? ObjectValueValidators<TModel, TValue>
    : {});

export type AsyncRuleValidators<TModel, TValue> = RuleValidators<
  TModel,
  TValue
> &
  AsyncBaseValueValidators<TModel, TValue>;

export type RuleValidatorsAndConditionExtensions<TModel, TValue> =
  RuleValidators<TModel, TValue> & {
    when: (
      condition: (model: TModel) => boolean,
      appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
    ) => RuleValidators<TModel, TValue>;
    unless: (
      condition: (model: TModel) => boolean,
      appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
    ) => RuleValidators<TModel, TValue>;
  };

export type AsyncRuleValidatorsAndConditionExtensions<TModel, TValue> =
  AsyncRuleValidators<TModel, TValue> & {
    when: (
      condition: (model: TModel) => boolean,
      appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
    ) => AsyncRuleValidators<TModel, TValue>;
    unless: (
      condition: (model: TModel) => boolean,
      appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
    ) => AsyncRuleValidators<TModel, TValue>;
  };

export type RuleValidatorsAndExtensions<TModel, TValue> =
  RuleValidatorsAndConditionExtensions<TModel, TValue> & {
    withMessage: (
      message: string
    ) => RuleValidatorsAndConditionExtensions<TModel, TValue>;
  };

export type AsyncRuleValidatorsAndExtensions<TModel, TValue> =
  AsyncRuleValidatorsAndConditionExtensions<TModel, TValue> & {
    withMessage: (
      message: string
    ) => AsyncRuleValidatorsAndConditionExtensions<TModel, TValue>;
  };
