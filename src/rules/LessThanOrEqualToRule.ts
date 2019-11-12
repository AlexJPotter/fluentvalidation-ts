import { Rule } from './Rule';

export class LessThanOrEqualToRule<TModel, TValue> extends Rule<
  TModel,
  TValue
> {
  constructor(threshold: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError(
          'A non-number value was passed to the lessThanOrEqualTo rule'
        );
      }
      return value <= threshold
        ? null
        : `Value must be less than or equal to ${threshold.toLocaleString()}`;
    });
  }
}
