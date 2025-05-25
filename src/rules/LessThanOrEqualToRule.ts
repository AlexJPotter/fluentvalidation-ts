import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class LessThanOrEqualToRule<TModel, TValue> extends Rule<TModel, TValue> {
  // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
  constructor(threshold: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError('A non-number value was passed to the lessThanOrEqualTo rule');
      }
      return value <= threshold
        ? null
        : `Value must be less than or equal to ${formatNumber(threshold)}`;
    });
  }
}
