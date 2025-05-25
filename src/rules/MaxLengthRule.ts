import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class MaxLengthRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(maxLength: number) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError('A non-string value was passed to the maxLength rule');
      }
      return value.length <= maxLength
        ? null
        : `Value must be no more than ${formatNumber(maxLength)} characters long`;
    });
  }
}
