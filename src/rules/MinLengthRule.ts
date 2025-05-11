import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class MinLengthRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(minLength: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError(
          'A non-string value was passed to the minLength rule'
        );
      }
      return value.length >= minLength
        ? null
        : `Value must be at least ${formatNumber(minLength)} characters long`;
    });
  }
}
