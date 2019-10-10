import {
  BaseValueValidators,
  NumberValueValidators,
  ObjectValueValidators,
  StringValueValidators,
} from './ValueValidator';

export type RuleValidators<
  TModel,
  TValue extends TModel[keyof TModel]
> = BaseValueValidators<TModel, TValue> &
  (TValue extends string | null | undefined
    ? StringValueValidators<TModel, TValue>
    : {}) &
  (TValue extends number | null | undefined
    ? NumberValueValidators<TModel, TValue>
    : {}) &
  (TValue extends object | null | undefined
    ? ObjectValueValidators<TModel, TValue>
    : {});

export type RuleValidatorsAndConditionExtensions<
  TModel,
  TValue extends TModel[keyof TModel]
> = RuleValidators<TModel, TValue> & {
  when: (
    condition: (model: TModel) => boolean,
    appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
  ) => RuleValidators<TModel, TValue>;
  unless: (
    condition: (model: TModel) => boolean,
    appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator'
  ) => RuleValidators<TModel, TValue>;
};

export type RuleValidatorsAndExtensions<
  TModel,
  TValue extends TModel[keyof TModel]
> = RuleValidatorsAndConditionExtensions<TModel, TValue> & {
  withMessage: (
    message: string
  ) => RuleValidatorsAndConditionExtensions<TModel, TValue>;
};
