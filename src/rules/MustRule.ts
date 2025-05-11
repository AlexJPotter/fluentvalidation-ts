import { Rule } from './Rule';

export class MustRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(
    definition:
      | ((value: TValue, model: TModel) => boolean)
      | {
          predicate: (value: TValue, model: TModel) => boolean;
          message: string | ((value: TValue, model: TModel) => string);
        }
      | Array<
          | ((value: TValue, model: TModel) => boolean)
          | {
              predicate: (value: TValue, model: TModel) => boolean;
              message: string | ((value: TValue, model: TModel) => string);
            }
        >
  ) {
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
