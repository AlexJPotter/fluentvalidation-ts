import { Rule } from './Rule';
import { Predicate } from '@/types/Predicate';

export class MustRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(definition: Predicate<TModel, TValue>) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
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
