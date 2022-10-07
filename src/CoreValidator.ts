import { AsyncArrayValueValidatorBuilder } from './valueValidator/AsyncArrayValueValidatorBuilder';
import { AsyncValueValidatorBuilder } from './valueValidator/AsyncValueValidatorBuilder';
import { ValidationErrors } from './ValidationErrors';
import { ArrayValueValidatorBuilder } from './valueValidator/ArrayValueValidatorBuilder';
import { AsyncRuleValidators } from './valueValidator/RuleValidators';
import { RuleValidators } from './valueValidator/RuleValidators';
import { hasError } from './valueValidator/ValueValidator';
import { ValueValidatorBuilder } from './valueValidator/ValueValidatorBuilder';
import { ValueValidationResult } from 'ValueValidationResult';
import { Constrain } from './types/Constrain';
import { ValueTransformer } from 'valueValidator/ValueTransformer';

type ValueValidatorBuildersByPropertyName<TModel> = {
  [propertyName in keyof TModel]?: Array<
    TModel[propertyName] extends Array<infer TEachValue>
      ?
          | ValueValidatorBuilder<
              TModel,
              TModel[propertyName],
              | TModel[propertyName]
              | string
              | number
              | boolean
              | null
              | undefined
              | symbol
            >
          | ArrayValueValidatorBuilder<
              TModel,
              propertyName,
              TModel[propertyName],
              TEachValue,
              TEachValue | string | number | boolean | null | undefined | symbol
            >
      : ValueValidatorBuilder<
          TModel,
          TModel[propertyName],
          | TModel[propertyName]
          | string
          | number
          | boolean
          | null
          | undefined
          | symbol
        >
  >;
};

type AsyncValueValidatorBuildersByPropertyName<TModel> = {
  [propertyName in keyof TModel]?: Array<
    TModel[propertyName] extends Array<infer TEachValue>
      ?
          | AsyncValueValidatorBuilder<
              TModel,
              TModel[propertyName],
              | TModel[propertyName]
              | string
              | number
              | boolean
              | null
              | undefined
              | symbol
            >
          | AsyncArrayValueValidatorBuilder<
              TModel,
              propertyName,
              TModel[propertyName],
              TEachValue,
              TEachValue | string | number | boolean | null | undefined | symbol
            >
      : AsyncValueValidatorBuilder<
          TModel,
          TModel[propertyName],
          | TModel[propertyName]
          | string
          | number
          | boolean
          | null
          | undefined
          | symbol
        >
  >;
};

export abstract class CoreValidator<TModel, TAsync extends true | false> {
  private _isAsync: TAsync;

  constructor(isAsync: TAsync) {
    this._isAsync = isAsync;
  }

  private valueValidatorBuildersByPropertyName: ValueValidatorBuildersByPropertyName<TModel> =
    {};

  private asyncValueValidatorBuildersByPropertyName: AsyncValueValidatorBuildersByPropertyName<TModel> =
    {};

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
        const valueValidatorBuilders =
          this.valueValidatorBuildersByPropertyName[
            propertyName as keyof TModel
          ];

        for (const valueValidatorBuilder of valueValidatorBuilders!) {
          const valueValidator = valueValidatorBuilder.build();

          const result = valueValidator(
            value[propertyName as keyof TModel],
            value
          ) as ValueValidationResult<TModel[keyof TModel]>;

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
    TValue extends TModel[TPropertyName]
  >(
    propertyName: TPropertyName
  ): TAsync extends true
    ? AsyncRuleValidators<TModel, TValue>
    : RuleValidators<TModel, TValue> => {
    if (this._isAsync) {
      const asyncValueValidatorBuilder = new AsyncValueValidatorBuilder<
        TModel,
        TValue,
        TValue
      >(this.rebuildValidateAsync, (value) => value);

      this.asyncValueValidatorBuildersByPropertyName[propertyName] =
        this.asyncValueValidatorBuildersByPropertyName[propertyName] || [];

      this.asyncValueValidatorBuildersByPropertyName[propertyName]!.push(
        asyncValueValidatorBuilder as any
      );

      return asyncValueValidatorBuilder.getAllRules() as unknown as AsyncRuleValidators<
        TModel,
        TValue
      > as any; // Appease the type system
    } else {
      const valueValidatorBuilder = new ValueValidatorBuilder<
        TModel,
        TValue,
        TValue
      >(this.rebuildValidate, (value) => value);

      this.valueValidatorBuildersByPropertyName[propertyName] =
        this.valueValidatorBuildersByPropertyName[propertyName] || [];

      this.valueValidatorBuildersByPropertyName[propertyName]!.push(
        valueValidatorBuilder as any
      );

      return valueValidatorBuilder.getAllRules() as unknown as RuleValidators<
        TModel,
        TValue
      > as any; // Appease the type system
    }
  };

  protected ruleForTransformed = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName],
    // We restrict the type to simple types, otherwise it would be possible to map a simple type
    // to a complex type and force an object/array property in the validation errors, when only
    // a simple property (`string | null`) is expected. `TValue` is also obviously accepted, since
    // the errors object will have the same shape in that case.
    TTransformedValue extends
      | TValue
      | string
      | number
      | boolean
      | null
      | undefined
      | symbol
  >(
    propertyName: TPropertyName,
    transformValue: (
      value: TValue
    ) => TTransformedValue extends object
      ? Constrain<TTransformedValue, TValue>
      : TTransformedValue
  ): TAsync extends true
    ? AsyncRuleValidators<TModel, TTransformedValue>
    : RuleValidators<TModel, TTransformedValue> => {
    if (this._isAsync) {
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
        asyncValueValidatorBuilder as any // Appease the type system
      );

      return asyncValueValidatorBuilder.getAllRules() as unknown as AsyncRuleValidators<
        TModel,
        TTransformedValue
      > as any; // Appease the type system
    } else {
      const valueValidatorBuilder = new ValueValidatorBuilder<
        TModel,
        TValue,
        TTransformedValue
      >(this.rebuildValidate, transformValue as any);

      this.valueValidatorBuildersByPropertyName[propertyName] =
        this.valueValidatorBuildersByPropertyName[propertyName] || [];

      this.valueValidatorBuildersByPropertyName[propertyName]!.push(
        valueValidatorBuilder as any
      );

      return valueValidatorBuilder.getAllRules() as unknown as RuleValidators<
        TModel,
        TTransformedValue
      > as any; // Appease the type system
    }
  };

  protected ruleForEach = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName] extends
      | Array<infer TEachValue>
      | ReadonlyArray<infer TEachValue>
      | Readonly<Array<infer TEachValue>>
      | null
      | undefined
      ? TModel[TPropertyName] &
          (
            | Array<TEachValue>
            | ReadonlyArray<TEachValue>
            | Readonly<Array<TEachValue>>
            | null
            | undefined
          )
      : never
  >(
    propertyName: TModel[TPropertyName] extends
      | Array<unknown>
      | ReadonlyArray<unknown>
      | Readonly<Array<unknown>>
      | null
      | undefined
      ? TPropertyName
      : never
  ): TValue extends
    | Array<unknown>
    | ReadonlyArray<unknown>
    | Readonly<Array<unknown>>
    ? TAsync extends true
      ? AsyncRuleValidators<TModel, TValue[0]>
      : RuleValidators<TModel, TValue[0]>
    : never => {
    if (this._isAsync) {
      const asyncArrayValueValidatorBuilder =
        new AsyncArrayValueValidatorBuilder(
          this.rebuildValidateAsync,
          propertyName as string,
          (value) => value
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
        propertyName as string,
        (value) => value
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

  protected ruleForEachTransformed = <
    TPropertyName extends keyof TModel,
    TValue extends TModel[TPropertyName] extends
      | Array<infer TEachValue>
      | ReadonlyArray<infer TEachValue>
      | Readonly<Array<infer TEachValue>>
      | null
      | undefined
      ? TModel[TPropertyName] &
          (
            | Array<TEachValue>
            | ReadonlyArray<TEachValue>
            | Readonly<Array<TEachValue>>
            | null
            | undefined
          )
      : never,
    // We restrict the type to simple types, otherwise it would be possible to map a simple type
    // to a complex type and force an object/array property in the validation errors, when only
    // a simple property (`string | null`) is expected. `TValue` is also obviously accepted, since
    // the errors object will have the same shape in that case.
    TEachTransformedValue extends
      | (TValue extends Array<infer TEachValue> ? TEachValue : never)
      | string
      | number
      | boolean
      | null
      | undefined
      | symbol
  >(
    propertyName: TModel[TPropertyName] extends
      | Array<unknown>
      | ReadonlyArray<unknown>
      | Readonly<Array<unknown>>
      | null
      | undefined
      ? TPropertyName
      : never,
    transformValue: (
      value: TModel[TPropertyName] extends
        | Array<infer TEachValue>
        | ReadonlyArray<infer TEachValue>
        | Readonly<Array<infer TEachValue>>
        ? TEachValue
        : never
    ) => TEachTransformedValue extends object
      ? Constrain<
          TEachTransformedValue,
          TModel[TPropertyName] extends
            | Array<infer TEachValue>
            | ReadonlyArray<infer TEachValue>
            | Readonly<Array<infer TEachValue>>
            ? TEachValue
            : never
        >
      : TEachTransformedValue
  ): TValue extends
    | Array<unknown>
    | ReadonlyArray<unknown>
    | Readonly<Array<unknown>>
    ? TAsync extends true
      ? AsyncRuleValidators<TModel, TEachTransformedValue>
      : RuleValidators<TModel, TEachTransformedValue>
    : never => {
    if (this._isAsync) {
      const asyncArrayValueValidatorBuilder =
        new AsyncArrayValueValidatorBuilder(
          this.rebuildValidateAsync,
          propertyName as string,
          transformValue as ValueTransformer<
            TModel[TPropertyName] extends
              | Array<infer TEachValue>
              | ReadonlyArray<infer TEachValue>
              | Readonly<Array<infer TEachValue>>
              ? TEachValue
              : never,
            TEachTransformedValue
          >
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
        propertyName as string,
        transformValue as any // Appease the type system
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
