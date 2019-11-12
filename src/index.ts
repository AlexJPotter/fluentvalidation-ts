import { ValidationErrors } from './ValidationErrors';
import { ArrayValueValidatorBuilder } from './valueValidator/ArrayValueValidatorBuilder';
import { RuleValidators } from './valueValidator/RuleValidators';
import { hasError } from './valueValidator/ValueValidator';
import { ValueValidatorBuilder } from './valueValidator/ValueValidatorBuilder';

type ValueValidatorBuildersByPropertyName<TModel> = {
  [propertyName in keyof TModel]?: Array<
    TModel[propertyName] extends Array<infer TEachValue>
      ?
          | ValueValidatorBuilder<TModel, TModel[propertyName]>
          | ArrayValueValidatorBuilder<
              TModel,
              propertyName,
              TModel[propertyName],
              TEachValue
            >
      : ValueValidatorBuilder<TModel, TModel[propertyName]>
  >;
};

export abstract class Validator<TModel> {
  private valueValidatorBuildersByPropertyName: ValueValidatorBuildersByPropertyName<
    TModel
  > = {};

  private _validate: (value: TModel) => ValidationErrors<TModel> = () => {
    return {};
  };

  private rebuildValidate = () => {
    this._validate = (value: TModel): ValidationErrors<TModel> => {
      const errors: ValidationErrors<TModel> = {};

      for (const propertyName of Object.keys(
        this.valueValidatorBuildersByPropertyName
      )) {
        const valueValidatorBuilders = this
          .valueValidatorBuildersByPropertyName[propertyName as keyof TModel];

        for (const valueValidatorBuilder of valueValidatorBuilders!) {
          const valueValidator = valueValidatorBuilder.build();
          const result = valueValidator(
            value[propertyName as keyof TModel],
            value
          );
          if (hasError(result)) {
            errors[propertyName as keyof TModel] = result;
          }
        }
      }

      return errors;
    };
  };

  public validate = (value: TModel): ValidationErrors<TModel> => {
    return this._validate(value);
  };

  protected ruleFor = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName]
  >(
    propertyName: TPropertyName
  ): RuleValidators<TModel, TValue> => {
    const valueValidatorBuilder = new ValueValidatorBuilder<TModel, TValue>(
      this.rebuildValidate
    );

    this.valueValidatorBuildersByPropertyName[propertyName] =
      this.valueValidatorBuildersByPropertyName[propertyName] || [];

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      valueValidatorBuilder as any
    );

    return (valueValidatorBuilder.getAllRules() as unknown) as RuleValidators<
      TModel,
      TValue
    >;
  };

  protected ruleForEach = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName] extends
      | Array<infer TEachValue>
      | null
      | undefined
      ? TModel[TPropertyName] & (Array<TEachValue> | null | undefined)
      : never
  >(
    propertyName: TModel[TPropertyName] extends
      | Array<unknown>
      | null
      | undefined
      ? TPropertyName
      : never
  ): TValue extends Array<unknown>
    ? RuleValidators<TModel, TValue[0]>
    : never => {
    const arrayValueValidatorBuilder = new ArrayValueValidatorBuilder(
      this.rebuildValidate,
      propertyName as string
    );

    if (this.valueValidatorBuildersByPropertyName[propertyName] == null) {
      this.valueValidatorBuildersByPropertyName[propertyName] = [];
    }

    this.valueValidatorBuildersByPropertyName[propertyName]!.push(
      arrayValueValidatorBuilder as any
    );

    return arrayValueValidatorBuilder.getAllRules() as any;
  };
}
