import { AsyncArrayValueValidatorBuilder } from './valueValidator/AsyncArrayValueValidatorBuilder';
import { AsyncValueValidatorBuilder } from './valueValidator/AsyncValueValidatorBuilder';
import { ValidationErrors } from './ValidationErrors';
import { ArrayValueValidatorBuilder } from './valueValidator/ArrayValueValidatorBuilder';
import { AsyncRuleValidators } from './valueValidator/RuleValidators';
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

type AsyncValueValidatorBuildersByPropertyName<TModel> = {
  [propertyName in keyof TModel]?: Array<
    TModel[propertyName] extends Array<infer TEachValue>
      ?
          | AsyncValueValidatorBuilder<TModel, TModel[propertyName]>
          | AsyncArrayValueValidatorBuilder<
              TModel,
              propertyName,
              TModel[propertyName],
              TEachValue
            >
      : AsyncValueValidatorBuilder<TModel, TModel[propertyName]>
  >;
};

export abstract class CoreValidator<TModel, TAsync extends true | false> {
  private _isAsync: TAsync;

  constructor(isAsync: TAsync) {
    this._isAsync = isAsync;
  }

  private valueValidatorBuildersByPropertyName: ValueValidatorBuildersByPropertyName<
    TModel
  > = {};

  private asyncValueValidatorBuildersByPropertyName: AsyncValueValidatorBuildersByPropertyName<
    TModel
  > = {};

  protected _validate: (value: TModel) => ValidationErrors<TModel> = () => {
    return {};
  };

  protected _validateAsync: (
    value: TModel
  ) => Promise<ValidationErrors<TModel>> = async () => {
    return Promise.resolve({});
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

  private rebuildValidateAsync = () => {
    this._validateAsync = async (
      value: TModel
    ): Promise<ValidationErrors<TModel>> => {
      const errors: ValidationErrors<TModel> = {};

      for (const propertyName of Object.keys(
        this.asyncValueValidatorBuildersByPropertyName
      )) {
        const asyncValueValidatorBuilders = this
          .asyncValueValidatorBuildersByPropertyName[
          propertyName as keyof TModel
        ];

        for (const asyncValueValidatorBuilder of asyncValueValidatorBuilders!) {
          const asyncValueValidator = asyncValueValidatorBuilder.build();
          const result = await asyncValueValidator(
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

  protected ruleFor = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName]
  >(
    propertyName: TPropertyName
  ): TAsync extends true
    ? AsyncRuleValidators<TModel, TValue>
    : RuleValidators<TModel, TValue> => {
    if (this._isAsync) {
      const asyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
        TModel,
        TValue
      >(this.rebuildValidateAsync);

      this.asyncValueValidatorBuildersByPropertyName[propertyName] =
        this.asyncValueValidatorBuildersByPropertyName[propertyName] || [];

      this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
        asyncValueValidatorBuilder as any
      );

      return ((asyncValueValidatorBuilder.getAllRules() as unknown) as AsyncRuleValidators<
        TModel,
        TValue
      >) as any; // Appease the type system
    } else {
      const valueValidatorBuilder = new ValueValidatorBuilder<TModel, TValue>(
        this.rebuildValidate
      );

      this.valueValidatorBuildersByPropertyName[propertyName] =
        this.valueValidatorBuildersByPropertyName[propertyName] || [];

      this.valueValidatorBuildersByPropertyName[propertyName]!.push(
        valueValidatorBuilder as any
      );

      return ((valueValidatorBuilder.getAllRules() as unknown) as RuleValidators<
        TModel,
        TValue
      >) as any; // Appease the type system
    }
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
    ? TAsync extends true
      ? AsyncRuleValidators<TModel, TValue[0]>
      : RuleValidators<TModel, TValue[0]>
    : never => {
    if (this._isAsync) {
      const asyncArrayValueValidatorBuilder = new AsyncArrayValueValidatorBuilder(
        this.rebuildValidateAsync,
        propertyName as string
      );

      if (
        this.asyncValueValidatorBuildersByPropertyName[propertyName] == null
      ) {
        this.asyncValueValidatorBuildersByPropertyName[propertyName] = [];
      }

      this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
        asyncArrayValueValidatorBuilder as any
      );

      return asyncArrayValueValidatorBuilder.getAllRules() as any;
    } else {
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
    }
  };
}

export class SyncValidator<TModel> extends CoreValidator<TModel, false> {
  public validate = (value: TModel): ValidationErrors<TModel> => {
    return this._validate(value);
  };

  constructor() {
    super(false);
  }
}

export class AsyncValidator<TModel> extends CoreValidator<TModel, true> {
  public validateAsync = (value: TModel): Promise<ValidationErrors<TModel>> => {
    return this._validateAsync(value);
  };

  constructor() {
    super(true);
  }
}
