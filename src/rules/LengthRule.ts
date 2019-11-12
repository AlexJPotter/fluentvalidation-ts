import { Rule } from './Rule';

export class LengthRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(minLength: number, maxLength: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError('A non-string value was passed to the length rule');
      }
      return value.length >= minLength && value.length <= maxLength
        ? null
        : `Value must be between ${minLength.toLocaleString()} and ${maxLength.toLocaleString()} characters long`;
    });
  }
}
