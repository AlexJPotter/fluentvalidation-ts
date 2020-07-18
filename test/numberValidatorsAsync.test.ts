import { AsyncValidator } from '../src/index';

describe('number validators (async)', () => {
  describe('lessThan', () => {
    const threshold = 44;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').lessThan(threshold);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not less than the threshold', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be less than ${threshold}`
      );
    });

    it('does not give a validation error if the value is less than the threshold', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 25,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).lessThan(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('lessThanOrEqualTo', () => {
    const maxValue = 44;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').lessThanOrEqualTo(maxValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is greater than the max value', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be less than or equal to ${maxValue}`
      );
    });

    it('does not give a validation error if the value is less than or equal to the max value', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 25,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).lessThanOrEqualTo(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('greaterThan', () => {
    const threshold = 44;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').greaterThan(threshold);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not greater than the threshold', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be greater than ${threshold}`
      );
    });

    it('does not give a validation error if the value is greater than the threshold', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).greaterThan(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('greaterThanOrEqualTo', () => {
    const minValue = 44;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').greaterThanOrEqualTo(minValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is less than the max value', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 43,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be greater than or equal to ${minValue}`
      );
    });

    it('does not give a validation error if the value is greater than or equal to the max value', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).greaterThanOrEqualTo(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('exclusiveBetween', () => {
    const lowerThreshold = 10;
    const upperThreshold = 20;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').exclusiveBetween(
          lowerThreshold,
          upperThreshold
        );
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too small', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 10,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (exclusive)`
      );
    });

    it('gives a validation error if the value is too large', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 20,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (exclusive)`
      );
    });

    it('does not give a validation error if the value is in the correct range', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 15,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).exclusiveBetween(0, 10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('inclusiveBetween', () => {
    const lowerThreshold = 10;
    const upperThreshold = 20;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').inclusiveBetween(
          lowerThreshold,
          upperThreshold
        );
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too small', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 9,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (inclusive)`
      );
    });

    it('gives a validation error if the value is too large', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 21,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (inclusive)`
      );
    });

    it('does not give a validation error if the value is in the correct range', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 15,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).inclusiveBetween(0, 10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });
  });

  describe('scalePrecision', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').scalePrecision(2, 4);
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is at the correct scale and precision', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 12.34,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is negative and at the correct scale and precision', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: -12.34,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('gives a validation error if there are too many decimal digits', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 1.234,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('gives a validation error if the value is negative and there are too many decimal digits', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: -1.234,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('gives a validation error if there are too many digits in total', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 123.45,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('gives a validation error if the value is negative and there are too many digits in total', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 123.45,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('throws an error if an invalid scale and precision are passed when setting the rule', () => {
      expect(() => {
        class BadValidator extends AsyncValidator<TestType> {
          constructor() {
            super();
            this.ruleFor('numberProperty').scalePrecision(4, 2);
          }
        }
        new BadValidator(); // tslint:disable-line
      }).toThrowError();
    });

    it('throws an error if it receives a non-number value', async () => {
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).scalePrecision(2, 4);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ name: 'Alex' });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowError(TypeError);
      }
    });

    it('handles large scales and precisions', async () => {
      class OtherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('numberProperty').scalePrecision(7, 14);
        }
      }
      const otherValidator = new OtherValidator();

      const validValues = [
        1234567.1234567,
        0.9999999,
        9999999,
        9999999.9999999,
        -1234567.1234567,
        -0.9999999,
        -9999999,
        -9999999.9999999,
      ];

      for (const validValue of validValues) {
        expect(
          (
            await otherValidator.validateAsync({
              ...testInstance,
              numberProperty: validValue,
            })
          ).numberProperty
        ).toBeUndefined();
      }

      const invalidValues = [
        1234567.12345678,
        0.99999999,
        99999999,
        -12345678.12345678,
        -0.99999999,
        -99999999.99999999,
      ];

      for (const invalidValue of invalidValues) {
        expect(
          (
            await otherValidator.validateAsync({
              ...testInstance,
              numberProperty: invalidValue,
            })
          ).numberProperty
        ).toBe(
          'Value must not be more than 14 digits in total, with allowance for 7 decimals'
        );
      }
    });
  });
});

type TestType = {
  stringProperty: string;
  nullableStringProperty: string | null;
  numberProperty: number;
  nullableNumberProperty: number | null;
  booleanProperty: boolean;
  nullableBooleanProperty: boolean | null;
  objectProperty: { nestedProperty: string };
  nullableObjectProperty: { nestedProperty: string } | null;
};

const testInstance: TestType = {
  stringProperty: '',
  nullableStringProperty: null,
  numberProperty: 0,
  nullableNumberProperty: null,
  booleanProperty: false,
  nullableBooleanProperty: null,
  objectProperty: { nestedProperty: '' },
  nullableObjectProperty: null,
};

type OtherTestType = {
  name: string;
};
