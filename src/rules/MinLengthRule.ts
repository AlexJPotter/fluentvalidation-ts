import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class MinLengthRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(minLength: number) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError('A non-string value was passed to the minLength rule');
      }
      return value.length >= minLength
        ? null
        : `Value must be at least ${formatNumber(minLength)} characters long`;
    });
  }
}
