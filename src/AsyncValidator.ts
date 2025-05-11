import { AsyncArrayValueValidatorBuilder } from '@/valueValidator/AsyncArrayValueValidatorBuilder';
import { AsyncValueValidatorBuilder } from '@/valueValidator/AsyncValueValidatorBuilder';
import { ValidationErrors } from '@/ValidationErrors';
import { AsyncRuleValidators } from '@/valueValidator/AsyncRuleValidators';
import { hasError } from '@/valueValidator/ValueValidator';
import { Constrain } from '@/types/Constrain';
import { ValueValidationResult } from '@/ValueValidationResult';
import { ValueTransformer } from '@/valueValidator/ValueTransformer';
import { ArrayType } from '@/types/ArrayType';
import { TransformedValue } from '@/types/TransformedValue';
import { AsyncValueValidator } from '@/valueValidator/AsyncValueValidator';
import { Optional } from '@/types/Optional';
import { IfNotNeverThen } from '@/types/IfNotNeverThen';

interface IAsyncValueValidatorBuilder<TModel> {
  build: () => AsyncValueValidator<TModel, unknown>;
}

export class AsyncValidator<TModel> {
  private asyncValueValidatorBuildersByPropertyName: {
    [propertyName in keyof TModel]?: Array<IAsyncValueValidatorBuilder<TModel>>;
  } = {};

  protected _validateAsync: (
    value: TModel
  ) => Promise<ValidationErrors<TModel>> = async () => {
    return Promise.resolve({});
  };

  public validateAsync = (value: TModel): Promise<ValidationErrors<TModel>> =>
    this._validateAsync(value);

  private rebuildValidateAsync = () => {
    this._validateAsync = async (
      value: TModel
    ): Promise<ValidationErrors<TModel>> => {
      const errors: ValidationErrors<TModel> = {};

      for (const propertyName of Object.keys(
        this.asyncValueValidatorBuildersByPropertyName
      )) {
        const asyncValueValidatorBuilders =
          this.asyncValueValidatorBuildersByPropertyName[
            propertyName as keyof TModel
          ];

        for (const asyncValueValidatorBuilder of asyncValueValidatorBuilders!) {
          const asyncValueValidator = asyncValueValidatorBuilder.build();

          const result = (await asyncValueValidator(
            value[propertyName as keyof TModel],
            value
          )) as ValueValidationResult<TModel[keyof TModel]>;

          if (hasError<TModel[keyof TModel]>(result)) {
            errors[propertyName as keyof TModel] = result;
          }
        }
      }

      return errors;
    };
  };

  protected ruleFor = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName],
  >(
    propertyName: TPropertyName
  ): AsyncRuleValidators<TModel, TValue> => {
    const asyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
      TModel,
      TModel[TPropertyName],
      TransformedValue<TModel[TPropertyName]>
    >(this.rebuildValidateAsync, (value) => value);

    this.asyncValueValidatorBuildersByPropertyName[propertyName] =
      this.asyncValueValidatorBuildersByPropertyName[propertyName] || [];

    this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
      asyncValueValidatorBuilder as IAsyncValueValidatorBuilder<TModel>
    );

    return asyncValueValidatorBuilder.getAllRules() as AsyncRuleValidators<
      TModel,
      TValue
    >;
  };

  protected ruleForTransformed = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName],
    TTransformedValue extends TransformedValue<TValue>,
  >(
    propertyName: TPropertyName,
    transformValue: (
      value: TValue
    ) => TTransformedValue extends object
      ? Constrain<TTransformedValue, TValue>
      : TTransformedValue
  ): AsyncRuleValidators<TModel, TTransformedValue> => {
    const asyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
      TModel,
      TValue,
      TTransformedValue
    >(
      this.rebuildValidateAsync,
      transformValue as ValueTransformer<TValue, TTransformedValue>
    );

    this.asyncValueValidatorBuildersByPropertyName[propertyName] =
      this.asyncValueValidatorBuildersByPropertyName[propertyName] || [];

    this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
      asyncValueValidatorBuilder as IAsyncValueValidatorBuilder<TModel>
    );

    return asyncValueValidatorBuilder.getAllRules() as AsyncRuleValidators<
      TModel,
      TTransformedValue
    >;
  };

  protected ruleForEach = <
    TPropertyName extends keyof TModel,
    TEachValue extends TModel[TPropertyName] extends Optional<
      ArrayType<infer TEachValueInferred>
    >
      ? TEachValueInferred
      : never,
    TValue extends TModel[TPropertyName] & ArrayType<TEachValue>,
  >(
    propertyName: IfNotNeverThen<TEachValue, TPropertyName>
  ): IfNotNeverThen<TEachValue, AsyncRuleValidators<TModel, TEachValue>> => {
    const asyncArrayValueValidatorBuilder = new AsyncArrayValueValidatorBuilder<
      TModel,
      TValue,
      TEachValue,
      TEachValue
    >(this.rebuildValidateAsync, (value) => value);

    if (this.asyncValueValidatorBuildersByPropertyName[propertyName] == null) {
      this.asyncValueValidatorBuildersByPropertyName[propertyName] = [];
    }

    this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
      asyncArrayValueValidatorBuilder as IAsyncValueValidatorBuilder<TModel>
    );

    return asyncArrayValueValidatorBuilder.getAllRules() as IfNotNeverThen<
      TEachValue,
      AsyncRuleValidators<TModel, TEachValue>
    >;
  };

  protected ruleForEachTransformed = <
    TPropertyName extends keyof TModel,
    TEachValue extends TModel[TPropertyName] extends Optional<
      ArrayType<infer TEachValueInferred>
    >
      ? TEachValueInferred
      : never,
    TValue extends TModel[TPropertyName] & ArrayType<TEachValue>,
    TEachTransformedValue extends TransformedValue<TEachValue>,
  >(
    propertyName: IfNotNeverThen<TEachValue, TPropertyName>,
    transformValue: (
      value: TEachValue
    ) => TEachTransformedValue extends object
      ? Constrain<TEachTransformedValue, TEachValue>
      : TEachTransformedValue
  ): IfNotNeverThen<
    TEachValue,
    AsyncRuleValidators<TModel, TEachTransformedValue>
  > => {
    const asyncArrayValueValidatorBuilder = new AsyncArrayValueValidatorBuilder<
      TModel,
      TValue,
      TEachValue,
      TEachTransformedValue
    >(this.rebuildValidateAsync, transformValue);

    if (this.asyncValueValidatorBuildersByPropertyName[propertyName] == null) {
      this.asyncValueValidatorBuildersByPropertyName[propertyName] = [];
    }

    this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
      asyncArrayValueValidatorBuilder as IAsyncValueValidatorBuilder<TModel>
    );

    return asyncArrayValueValidatorBuilder.getAllRules() as IfNotNeverThen<
      TEachValue,
      AsyncRuleValidators<TModel, TEachTransformedValue>
    >;
  };
}
