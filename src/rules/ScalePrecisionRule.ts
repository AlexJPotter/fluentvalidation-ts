import { Rule } from './Rule';

export class ScalePrecisionRule<TModel, TValue> extends Rule<TModel, TValue> {
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
      const regex = scalePrecisionRegex(scale, precision);
      if (!regex.test(value.toString())) {
        return `Value must not be more than ${scale} digits in total, with allowance for ${precision} decimals`;
      }
      return null;
    });
  }
}

const scalePrecisionRegex = (scale: number, precision: number) =>
  new RegExp(
    `^(-)?([0-9]){0,${scale - precision}}(\\.[0-9]{0,${precision}})?$`
  );
