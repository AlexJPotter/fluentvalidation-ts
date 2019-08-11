import { Validator } from '../src/index';

describe('number validators', () => {
  describe('lessThan', () => {
    const threshold = 44;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').lessThan(threshold);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not less than the threshold', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be less than ${threshold}`
      );
    });

    it('does not give a validation error if the value is less than the threshold', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 25,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).lessThan(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('lessThanOrEqualTo', () => {
    const maxValue = 44;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').lessThanOrEqualTo(maxValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is greater than the max value', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be less than or equal to ${maxValue}`
      );
    });

    it('does not give a validation error if the value is less than or equal to the max value', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 25,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).lessThanOrEqualTo(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('greaterThan', () => {
    const threshold = 44;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').greaterThan(threshold);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not greater than the threshold', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be greater than ${threshold}`
      );
    });

    it('does not give a validation error if the value is greater than the threshold', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).greaterThan(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('greaterThanOrEqualTo', () => {
    const minValue = 44;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').greaterThanOrEqualTo(minValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is less than the max value', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 43,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be greater than or equal to ${minValue}`
      );
    });

    it('does not give a validation error if the value is greater than or equal to the max value', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 45,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).greaterThanOrEqualTo(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('exclusiveBetween', () => {
    const lowerThreshold = 10;
    const upperThreshold = 20;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').exclusiveBetween(
          lowerThreshold,
          upperThreshold
        );
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too small', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 10,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (exclusive)`
      );
    });

    it('gives a validation error if the value is too large', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 20,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (exclusive)`
      );
    });

    it('does not give a validation error if the value is in the correct range', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 15,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).exclusiveBetween(0, 10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('inclusiveBetween', () => {
    const lowerThreshold = 10;
    const upperThreshold = 20;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').inclusiveBetween(
          lowerThreshold,
          upperThreshold
        );
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too small', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 9,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (inclusive)`
      );
    });

    it('gives a validation error if the value is too large', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 21,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        `Value must be between ${lowerThreshold} and ${upperThreshold} (inclusive)`
      );
    });

    it('does not give a validation error if the value is in the correct range', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 15,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).inclusiveBetween(0, 10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
    });
  });

  describe('scalePrecision', () => {
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').scalePrecision(2, 4);
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is at the correct scale and precision', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 12.34,
      };
      const result = validator.validate(valid);
      expect(result.nullableNumberProperty).toBeUndefined();
    });

    it('gives a validation error if there are too many decimal digits', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 1.234,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('gives a validation error if there are too many digits in total', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: 123.45,
      };
      const result = validator.validate(invalid);
      expect(result.nullableNumberProperty).toBe(
        'Value must not be more than 4 digits in total, with allowance for 2 decimals'
      );
    });

    it('throws an error if an invalid scale and precision are passed when setting the rule', () => {
      expect(() => {
        class BadValidator extends Validator<TestType> {
          constructor() {
            super();
            this.ruleFor('numberProperty').scalePrecision(4, 2);
          }
        }
        new BadValidator();
      }).toThrowError();
    });

    it('throws an error if it receives a non-number value', () => {
      class OtherTestTypeValidator extends Validator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('name') as any).scalePrecision(2, 4);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      expect(() => otherValidator.validate({ name: 'Alex' })).toThrowError(
        TypeError
      );
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
