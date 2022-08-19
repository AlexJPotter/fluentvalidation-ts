import { formatNumber } from '../src/numberHelpers';

describe('numberHelpers', () => {
  describe('formatNumber', () => {
    it('formats large numbers', () => {
      const value = 999_999_999_999;
      const result = formatNumber(value);
      expect(result).toBe('999,999,999,999');
    });

    it('formats small numbers', () => {
      const value = 0.00000000000000000001;
      const result = formatNumber(value);
      expect(result).toBe('0.00000000000000000001');
    });

    it('formats long numbers', () => {
      const value = 123_456_789.123_456_78;
      const result = formatNumber(value);
      expect(result).toBe('123,456,789.12345678');
    });
  });
});
