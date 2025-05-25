import { Rule } from './Rule';

export class PrecisionScaleRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(precision: number, scale: number) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (value == null || value === 0) {
        return null;
      }
      if (typeof value !== 'number') {
        throw new TypeError('A non-number value was passed to the precisionScale rule');
      }

      const regex = precisionScaleRegex({ precision, scale });

      if (!regex.test(value.toString())) {
        return `Value must not be more than ${precision} digits in total, with allowance for ${scale} decimals`;
      }

      return null;
    });
  }
}

const precisionScaleRegex = ({ precision, scale }: { precision: number; scale: number }) => {
  const integerDigits = precision - scale;

  return integerDigits === 0
    ? new RegExp(`^-?0?\\.\\d{0,${scale}}$`) // The leading 0 to the left of the decimal point does not count towards precision
    : new RegExp(`^-?\\d{1,${integerDigits}}(\\.\\d{1,${scale}})?$`);
};
