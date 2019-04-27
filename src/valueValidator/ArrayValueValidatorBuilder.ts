import { ValueValidationResult } from '../ValueValidationResult';
import { ValueValidator } from '../ValueValidator';
import { hasError } from './ValueValidator';
import { ValueValidatorBuilder } from './ValueValidatorBuilder';

export class ArrayValueValidatorBuilder<
  TModel,
  TPropertyName extends keyof TModel,
  TValue extends Array<TEachValue> & TModel[TPropertyName],
  TEachValue
> {
  private eachValueValidatorBuilder: ValueValidatorBuilder<
    TValue,
    number,
    TValue[0] & TEachValue
  >;

  constructor(rebuildValidate: () => void) {
    this.eachValueValidatorBuilder = new ValueValidatorBuilder<
      TValue,
      number,
      TValue[0] & TEachValue
    >(rebuildValidate);
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel) => {
      if (value == null) {
        return null;
      }

      const valueValidator = this.eachValueValidatorBuilder.build();
      const errors = {} as ValueValidationResult<TValue>;

      for (let index = 0; index < value.length; index++) {
        const errorOrNull = valueValidator(value[index] as TValue[0], value);
        if (hasError(errorOrNull)) {
          (errors as any)[index] = errorOrNull;
        }
      }

      return hasError(errors) ? errors : null;
    };
  };

  public notEqual = (forbiddenValue: TEachValue) => {
    return this.eachValueValidatorBuilder.notEqual(forbiddenValue as TValue[0]);
  };

  public equal = (requiredValue: TEachValue) => {
    return this.eachValueValidatorBuilder.equal(requiredValue as TValue[0]);
  };

  public must = (predicate: (value: TEachValue) => boolean) => {
    return this.eachValueValidatorBuilder.must(predicate);
  };

  public notNull = () => {
    return this.eachValueValidatorBuilder.notNull();
  };

  public null = () => {
    return this.eachValueValidatorBuilder.null();
  };

  public notEmpty = () => {
    return this.eachValueValidatorBuilder.notEmpty();
  };

  public length = (minLength: number, maxLength: number) => {
    return this.eachValueValidatorBuilder.length(minLength, maxLength);
  };

  public maxLength = (maxLength: number) => {
    return this.eachValueValidatorBuilder.maxLength(maxLength);
  };

  public minLength = (minLength: number) => {
    return this.eachValueValidatorBuilder.minLength(minLength);
  };

  public matches = (pattern: RegExp) => {
    return this.eachValueValidatorBuilder.matches(pattern);
  };

  public emailAddress = () => {
    return this.eachValueValidatorBuilder.emailAddress();
  };

  public lessThan = (threshold: number) => {
    return this.eachValueValidatorBuilder.lessThan(threshold);
  };

  public lessThanOrEqualTo = (threshold: number) => {
    return this.eachValueValidatorBuilder.lessThanOrEqualTo(threshold);
  };

  public greaterThan = (threshold: number) => {
    return this.eachValueValidatorBuilder.greaterThan(threshold);
  };

  public greaterThanOrEqualTo = (threshold: number) => {
    return this.eachValueValidatorBuilder.greaterThanOrEqualTo(threshold);
  };

  public exclusiveBetween = (lowerBound: number, upperBound: number) => {
    return this.eachValueValidatorBuilder.exclusiveBetween(
      lowerBound,
      upperBound
    );
  };

  public inclusiveBetween = (lowerBound: number, upperBound: number) => {
    return this.eachValueValidatorBuilder.inclusiveBetween(
      lowerBound,
      upperBound
    );
  };

  public getAllRules = () => this.eachValueValidatorBuilder.getAllRules();
}
