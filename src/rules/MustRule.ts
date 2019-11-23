import { Rule } from './Rule';

export type MustRulePredicate<TModel, TValue> = (
  value: TValue,
  model: TModel
) => boolean;

export type MustRulePredicateAndErrorMessage<TModel, TValue> = {
  predicate: MustRulePredicate<TModel, TValue>;
  message: string | ((value: TValue, model: TModel) => string);
};

export type MustRuleDefinition<TModel, TValue> =
  | MustRulePredicate<TModel, TValue>
  | MustRulePredicateAndErrorMessage<TModel, TValue>
  | Array<
      | MustRulePredicate<TModel, TValue>
      | MustRulePredicateAndErrorMessage<TModel, TValue>
    >;

export class MustRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(definition: MustRuleDefinition<TModel, TValue>) {
    super((value: TValue, model: TModel) => {
      if (Array.isArray(definition)) {
        for (const eachDefinition of definition) {
          if (typeof eachDefinition === 'function') {
            const isValid = eachDefinition(value, model);
            if (!isValid) {
              return 'Value is not valid';
            }
          } else {
            const isValid = eachDefinition.predicate(value, model);
            if (!isValid) {
              return typeof eachDefinition.message === 'function'
                ? eachDefinition.message(value, model)
                : eachDefinition.message;
            }
          }
        }
        return null;
      }

      if (typeof definition === 'function') {
        return definition(value, model) ? null : 'Value is not valid';
      }

      const { predicate, message } = definition;

      return predicate(value, model)
        ? null
        : typeof message === 'function'
        ? message(value, model)
        : message;
    });
  }
}
