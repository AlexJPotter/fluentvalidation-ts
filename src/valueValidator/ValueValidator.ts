import { IValidator } from '../IValidator';
import { ValueValidationResult } from '../ValueValidationResult';
import { RuleValidatorsAndExtensions } from './RuleValidators';

export const hasError = <TValue>(
  valueValidationResult: ValueValidationResult<TValue>
): boolean => {
  if (valueValidationResult == null) {
    return false;
  }

  if (typeof valueValidationResult === 'object') {
    return Object.keys(valueValidationResult as object).length > 0;
  }

  return valueValidationResult != null;
};

export type BaseValueValidators<TModel, TValue extends TModel[keyof TModel]> = {
  notNull: () => RuleValidatorsAndExtensions<TModel, TValue>;
  null: () => RuleValidatorsAndExtensions<TModel, TValue>;
  notEqual: (
    forbiddenValue: TValue
  ) => RuleValidatorsAndExtensions<TModel, TValue>;
  equal: (requiredValue: TValue) => RuleValidatorsAndExtensions<TModel, TValue>;
  must: (
    predicate: (value: TValue, model: TModel) => boolean
  ) => RuleValidatorsAndExtensions<TModel, TValue>;
};

export type StringValueValidators<
  TModel,
  TValue extends TModel[keyof TModel] & (string | null | undefined)
  > = {
    notEmpty: () => RuleValidatorsAndExtensions<TModel, TValue>;
    length: (
      minLength: number,
      maxLength: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    maxLength: (maxLength: number) => RuleValidatorsAndExtensions<TModel, TValue>;
    minLength: (minLength: number) => RuleValidatorsAndExtensions<TModel, TValue>;
    matches: (pattern: RegExp) => RuleValidatorsAndExtensions<TModel, TValue>;
    emailAddress: () => RuleValidatorsAndExtensions<TModel, TValue>;
  };

export type NumberValueValidators<
  TModel,
  TValue extends TModel[keyof TModel] & (number | null | undefined)
  > = {
    lessThan: (threshold: number) => RuleValidatorsAndExtensions<TModel, TValue>;
    lessThanOrEqualTo: (
      threshold: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    greaterThan: (
      threshold: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    greaterThanOrEqualTo: (
      threshold: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    exclusiveBetween: (
      lowerBound: number,
      upperBound: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    inclusiveBetween: (
      lowerBound: number,
      upperBound: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
    scalePrecision: (
      precision: number,
      scale: number
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
  };

export type ObjectValueValidators<
  TModel,
  TValue extends TModel[keyof TModel] & (object | null | undefined)
  > = {
    setValidator: (
      // TODO: For some reason these types seem to give us what we want, but they don't seem quite right
      validatorProducer: () => IValidator<TValue extends null | undefined ? any : TValue>
    ) => RuleValidatorsAndExtensions<TModel, TValue>;
  };
