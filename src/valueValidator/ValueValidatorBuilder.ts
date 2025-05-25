import { hasError } from './ValueValidator';
import { CoreValueValidatorBuilder } from './CoreValueValidatorBuilder';
import { ValueTransformer } from './ValueTransformer';
import { Rule } from '@/rules/Rule';
import { ValueValidationResult } from '@/ValueValidationResult';
import { ValueValidator } from '@/ValueValidator';
import {
  RuleValidators,
  RuleValidatorsAndConditionExtensions,
  RuleValidatorsAndExtensions,
} from '@/valueValidator/RuleValidators';

export class ValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue,
> extends CoreValueValidatorBuilder<
  TModel,
  TValue,
  TTransformedValue,
  RuleValidators<TModel, TTransformedValue>,
  RuleValidatorsAndConditionExtensions<TModel, TTransformedValue>,
  RuleValidatorsAndExtensions<TModel, TTransformedValue>
> {
  constructor(
    rebuildValidate: () => void,
    transformValue: ValueTransformer<TValue, TTransformedValue>,
  ) {
    super(rebuildValidate, transformValue);
  }

  public build = (): ValueValidator<TModel, TValue> => {
    return (value: TValue, model: TModel): ValueValidationResult<TValue> => {
      const transformedValue = this.transformValue(value);

      for (const rule of this.rules) {
        const validationResult = (rule.rule as Rule<TModel, TTransformedValue>).validate(
          transformedValue,
          model,
        ) as ValueValidationResult<TValue>;

        if (hasError(validationResult)) {
          return validationResult;
        }
      }

      return null;
    };
  };

  public getAllRules = () => this._getAllRules() as RuleValidators<TModel, TTransformedValue>;

  public getAllRulesAndConditionExtensions = () =>
    ({
      ...this.getAllRules(),
      when: this.when,
      unless: this.unless,
    }) as RuleValidatorsAndConditionExtensions<TModel, TTransformedValue>;

  public getAllRulesAndExtensions = () =>
    ({
      ...this.getAllRulesAndConditionExtensions(),
      withMessage: this.withMessage,
    }) as RuleValidatorsAndExtensions<TModel, TTransformedValue>;
}
