import { ValidationErrors } from '@/ValidationErrors';
import { ArrayValueValidatorBuilder } from '@/valueValidator/ArrayValueValidatorBuilder';
import { RuleValidators } from '@/valueValidator/RuleValidators';
import { hasError } from '@/valueValidator/ValueValidator';
import { ValueValidatorBuilder } from '@/valueValidator/ValueValidatorBuilder';
import { Constrain } from '@/types/Constrain';
import { ArrayType } from '@/types/ArrayType';
import { TransformedValue } from '@/types/TransformedValue';
import { ValueValidator } from '@/ValueValidator';
import { Optional } from '@/types/Optional';
import { IfNotNeverThen } from '@/types/IfNotNeverThen';

interface IValueValidatorBuilder<TModel> {
  build: () => ValueValidator<TModel, unknown>;
}

export class SyncValidator<TModel> {
  private valueValidatorBuildersByPropertyName: {
    [propertyName in keyof TModel]?: Array<IValueValidatorBuilder<TModel>>;
  } = {};

  protected _validate: (value: TModel) => ValidationErrors<TModel> = () => {
    return {};
  };

  public validate = (value: TModel): ValidationErrors<TModel> => this._validate(value);

  private rebuildValidate = () => {
    this._validate = (value: TModel): ValidationErrors<TModel> => {
      const errors: ValidationErrors<TModel> = {};

      for (const propertyName of Object.keys(this.valueValidatorBuildersByPropertyName)) {
        const valueValidatorBuilders =
          this.valueValidatorBuildersByPropertyName[propertyName as keyof TModel];

        for (const valueValidatorBuilder of valueValidatorBuilders!) {
          const valueValidator = valueValidatorBuilder.build();

          const result = valueValidator(value[propertyName as keyof TModel], value);

          if (hasError(result)) {
            errors[propertyName as keyof TModel] = result;
          }
        }
      }

      return errors;
    };
  };

  protected ruleFor = <TPropertyName extends keyof TModel, TValue extends TModel[TPropertyName]>(
    propertyName: TPropertyName,
  ): RuleValidators<TModel, TValue> => {
    const valueValidatorBuilder = new ValueValidatorBuilder<TModel, TValue, TValue>(
      this.rebuildValidate,
      (value) => value,
    );

    this.valueValidatorBuildersByPropertyName[propertyName] =
      this.valueValidatorBuildersByPropertyName[propertyName] || [];

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      valueValidatorBuilder as IValueValidatorBuilder<TModel>,
    );

    return valueValidatorBuilder.getAllRules();
  };

  protected ruleForTransformed = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName],
    TTransformedValue extends TransformedValue<TValue>,
  >(
    propertyName: TPropertyName,
    transformValue: (
      value: TValue,
    ) => TTransformedValue extends object
      ? Constrain<TTransformedValue, TValue>
      : TTransformedValue,
  ): RuleValidators<TModel, TTransformedValue> => {
    const valueValidatorBuilder = new ValueValidatorBuilder<TModel, TValue, TTransformedValue>(
      this.rebuildValidate,
      transformValue,
    );

    this.valueValidatorBuildersByPropertyName[propertyName] =
      this.valueValidatorBuildersByPropertyName[propertyName] || [];

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      valueValidatorBuilder as IValueValidatorBuilder<TModel>,
    );

    return valueValidatorBuilder.getAllRules();
  };

  protected ruleForEach = <
    TPropertyName extends keyof TModel,
    TEachValue extends TModel[TPropertyName] extends Optional<ArrayType<infer TEachValueInferred>>
      ? TEachValueInferred
      : never,
    TValue extends TModel[TPropertyName] & ArrayType<TEachValue>,
  >(
    propertyName: IfNotNeverThen<TEachValue, TPropertyName>,
  ): IfNotNeverThen<TEachValue, RuleValidators<TModel, TEachValue>> => {
    const arrayValueValidatorBuilder = new ArrayValueValidatorBuilder<
      TModel,
      TValue,
      TEachValue,
      TEachValue
    >(this.rebuildValidate, (value) => value);

    if (this.valueValidatorBuildersByPropertyName[propertyName] == null) {
      this.valueValidatorBuildersByPropertyName[propertyName] = [];
    }

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      arrayValueValidatorBuilder as IValueValidatorBuilder<TModel>,
    );

    return arrayValueValidatorBuilder.getAllRules() as IfNotNeverThen<
      TEachValue,
      RuleValidators<TModel, TEachValue>
    >;
  };

  protected ruleForEachTransformed = <
    TPropertyName extends keyof TModel,
    TEachValue extends TModel[TPropertyName] extends Optional<ArrayType<infer TEachValueInferred>>
      ? TEachValueInferred
      : never,
    TValue extends TModel[TPropertyName] & ArrayType<TEachValue>,
    TEachTransformedValue extends TransformedValue<TEachValue>,
  >(
    propertyName: IfNotNeverThen<TEachValue, TPropertyName>,
    transformValue: (
      value: TEachValue,
    ) => TEachTransformedValue extends object
      ? Constrain<TEachTransformedValue, TEachValue>
      : TEachTransformedValue,
  ): IfNotNeverThen<TEachValue, RuleValidators<TModel, TEachTransformedValue>> => {
    const arrayValueValidatorBuilder = new ArrayValueValidatorBuilder<
      TModel,
      TValue,
      TEachValue,
      TEachTransformedValue
    >(this.rebuildValidate, transformValue);

    if (this.valueValidatorBuildersByPropertyName[propertyName] == null) {
      this.valueValidatorBuildersByPropertyName[propertyName] = [];
    }

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      arrayValueValidatorBuilder as IValueValidatorBuilder<TModel>,
    );

    return arrayValueValidatorBuilder.getAllRules() as IfNotNeverThen<
      TEachValue,
      RuleValidators<TModel, TEachTransformedValue>
    >;
  };
}
