import { Rule } from './Rule';

export class ScalePrecisionRule<
  TModel,
  TValue extends TModel[keyof TModel]
> extends Rule<TModel, TValue> {
  constructor(precision: number, scale: number) {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError(
          'A non-number value was passed to the scalePrecision rule'
        );
      }
      const shiftedValue = value * Math.pow(10, precision);
      if (shiftedValue % 1 !== 0 || shiftedValue.toString().length > scale) {
        return `Value must not be more than ${scale} digits in total, with allowance for ${precision} decimals`;
      }
      return null;
    });
  }
}
