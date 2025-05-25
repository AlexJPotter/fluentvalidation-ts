import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class ExclusiveBetweenRule<TModel, TValue> extends Rule<TModel, TValue> {
  // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
  constructor(lowerBound: number, upperBound: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError('A non-number value was passed to the exclusiveBetween rule');
      }
      return value > lowerBound && value < upperBound
        ? null
        : `Value must be between ${formatNumber(lowerBound)} and ${formatNumber(upperBound)} (exclusive)`;
    });
  }
}
