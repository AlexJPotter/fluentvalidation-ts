import { AsyncRule } from './AsyncRule';

export class MustAsyncRule<TModel, TValue> extends AsyncRule<TModel, TValue> {
  constructor(
    definition:
      | ((value: TValue, model: TModel) => Promise<boolean>)
      | {
          predicate: (value: TValue, model: TModel) => Promise<boolean>;
          message: string | ((value: TValue, model: TModel) => string);
        }
      | Array<
          | ((value: TValue, model: TModel) => Promise<boolean>)
          | {
              predicate: (value: TValue, model: TModel) => Promise<boolean>;
              message: string | ((value: TValue, model: TModel) => string);
            }
        >
  ) {
    super(async (value: TValue, model: TModel) => {
      if (Array.isArray(definition)) {
        for (const eachDefinition of definition) {
          if (typeof eachDefinition === 'function') {
            const isValid = await eachDefinition(value, model);
            if (!isValid) {
              return 'Value is not valid';
            }
          } else {
            const isValid = await eachDefinition.predicate(value, model);
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
        return (await definition(value, model)) ? null : 'Value is not valid';
      }

      const { predicate, message } = definition;

      return (await predicate(value, model))
        ? null
        : typeof message === 'function'
        ? message(value, model)
        : message;
    });
  }
}
