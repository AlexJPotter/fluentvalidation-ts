import { Rule } from './Rule';

export class NotEmptyRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (typeof value !== 'string') {
        if (value == null) {
          return null;
        }
        throw new TypeError(
          'A non-string value was passed to the notEmpty rule'
        );
      }
      return value.trim().length > 0 ? null : 'Value cannot be empty';
    });
  }
}
