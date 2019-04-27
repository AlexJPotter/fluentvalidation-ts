import { ValidationErrors } from './ValidationErrors';
import { RuleValidators } from './valueValidator/RuleValidators';
export declare abstract class Validator<TModel> {
    private valueValidatorBuildersByPropertyName;
    private _validate;
    private rebuildValidate;
    validate: (value: TModel) => ValidationErrors<TModel>;
    protected ruleFor: <TPropertyName extends keyof TModel, TValue extends TModel[TPropertyName]>(propertyName: TPropertyName) => RuleValidators<TModel, TValue>;
    protected ruleForEach: <TPropertyName extends keyof TModel, TValue extends TModel[TPropertyName] extends (infer TEachValue)[] | null | undefined ? (TModel[TPropertyName] & undefined) | (TModel[TPropertyName] & null) | (TModel[TPropertyName] & TEachValue[]) : never>(propertyName: TModel[TPropertyName] extends (infer TEachValue)[] | null | undefined ? TPropertyName : never) => TValue extends (infer TEachValue)[] ? RuleValidators<TValue, TValue[0]> : never;
}
