import { Rule } from './Rule';
import { formatNumber } from '@/numberHelpers';

export class LessThanRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(threshold: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError(
          'A non-number value was passed to the lessThan rule'
        );
      }
      return value < threshold
        ? null
        : `Value must be less than ${formatNumber(threshold)}`;
    });
  }
}
