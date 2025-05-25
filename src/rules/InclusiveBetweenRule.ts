import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class InclusiveBetweenRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(lowerBound: number, upperBound: number) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError('A non-number value was passed to the inclusiveBetween rule');
      }
      return value >= lowerBound && value <= upperBound
        ? null
        : `Value must be between ${formatNumber(lowerBound)} and ${formatNumber(upperBound)} (inclusive)`;
    });
  }
}
