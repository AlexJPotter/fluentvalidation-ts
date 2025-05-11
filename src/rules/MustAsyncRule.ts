import { AsyncRule } from './AsyncRule';
import { AsyncPredicate } from '@/types/Predicate';

export class MustAsyncRule<TModel, TValue> extends AsyncRule<TModel, TValue> {
  constructor(definition: AsyncPredicate<TModel, TValue>) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
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
