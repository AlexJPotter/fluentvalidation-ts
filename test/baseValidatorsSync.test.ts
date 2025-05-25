import { Validator } from '@/index';

describe('base validators (sync)', () => {
  describe('notNull', () => {
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').notNull();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is null', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = validator.validate(invalid);
      expect(result).toEqual({
        nullableNumberProperty: 'Value cannot be null',
      });
    });

    it('does not give a validation error if the value is not null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = validator.validate(valid);
      expect(result).toEqual({});
    });
  });

  describe('null', () => {
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').null();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not null', () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'Not null',
      };
      const result = validator.validate(invalid);
      expect(result).toEqual({
        nullableStringProperty: 'Value must be null',
      });
    });

    it('does not give a validation error if the value is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = validator.validate(valid);
      expect(result).toEqual({});
    });
  });

  describe('notEqual', () => {
    const forbiddenValue = 'Forbidden';
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('stringProperty').notEqual(forbiddenValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is equal to the forbidden value', () => {
      const invalid: TestType = {
        ...testInstance,
        stringProperty: forbiddenValue,
      };
      const result = validator.validate(invalid);
      expect(result.stringProperty).toBe(`Must not equal '${forbiddenValue}'`);
    });

    it('does not give a validation error if the value is not equal to the forbidden value', () => {
      const valid: TestType = {
        ...testInstance,
        stringProperty: `Not ${forbiddenValue}`,
      };
      const result = validator.validate(valid);
      expect(result.stringProperty).toBeUndefined();
    });

    it('gives a type error if the comparison value is of a different type', () => {
      // @ts-ignore
      class AnotherValidator extends Validator<TestType> {
        constructor() {
          super();
          // @ts-expect-error
          this.ruleFor('stringProperty').notEqual(5);
        }
      }
    });
  });

  describe('equal', () => {
    const requiredValue = 44;
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('numberProperty').equal(requiredValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not equal to the required value', () => {
      const invalid: TestType = {
        ...testInstance,
        numberProperty: 2019,
      };
      const result = validator.validate(invalid);
      expect(result.numberProperty).toBe(`Must equal '44'`);
    });

    it('does not give a validation error if the value is equal to the required value', () => {
      const valid: TestType = {
        ...testInstance,
        numberProperty: requiredValue,
      };
      const result = validator.validate(valid);
      expect(result.numberProperty).toBeUndefined();
    });

    it('gives a type error if the comparison value is of a different type', () => {
      // @ts-ignore
      class AnotherValidator extends Validator<TestType> {
        constructor() {
          super();
          // @ts-expect-error
          this.ruleFor('stringProperty').equal(5);
        }
      }
    });
  });

  describe('must', () => {
    describe('when passed a predicate', () => {
      class TestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must((stringProperty) => stringProperty.length > 10);
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if the predicate is not met', () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = validator.validate(invalid);
        expect(result.stringProperty).toBe('Value is not valid');
      });

      it('does not give a validation error if the predicate is met', () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = validator.validate(invalid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', () => {
        class OtherValidator extends Validator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty')
              .must((value, model) => value.length === model.numberProperty)
              .withMessage('String property length must match number property value');
          }
        }
        const otherValidator = new OtherValidator();
        const valid: TestType = {
          ...testInstance,
          stringProperty: 'Valid',
          numberProperty: 5,
        };
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'Invalid',
          numberProperty: 1,
        };
        expect(otherValidator.validate(valid).stringProperty).toBeUndefined();
        expect(otherValidator.validate(invalid).stringProperty).toBe(
          'String property length must match number property value',
        );
      });
    });

    describe('when passed a rule definition', () => {
      const beAtLeastTenCharactersLong = {
        predicate: (value: string) => value.length >= 10,
        message: 'Please enter at least 10 characters',
      };
      class TestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must(beAtLeastTenCharactersLong);
        }
      }
      const validator = new TestValidator();

      it('gives a validation error with the specified message if the predicate is not met', () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = validator.validate(invalid);
        expect(result.stringProperty).toBe('Please enter at least 10 characters');
      });

      it('does not give a validation error if the predicate is met', () => {
        const valid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = validator.validate(valid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: (value: string, model: TestType) => value.length === model.numberProperty,
          message: 'String property length must match number property value',
        };
        class OtherValidator extends Validator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty').must(haveLengthEqualToTheNumberProperty);
          }
        }
        const otherValidator = new OtherValidator();
        const valid: TestType = {
          ...testInstance,
          stringProperty: 'Valid',
          numberProperty: 5,
        };
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'Invalid',
          numberProperty: 1,
        };
        expect(otherValidator.validate(valid).stringProperty).toBeUndefined();
        expect(otherValidator.validate(invalid).stringProperty).toBe(
          'String property length must match number property value',
        );
      });

      it('still allows the message to be overridden', () => {
        class OtherValidator extends Validator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty')
              .must(beAtLeastTenCharactersLong)
              .withMessage('Not long enough!');
          }
        }
        const otherValidator = new OtherValidator();
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = otherValidator.validate(invalid);
        expect(result.stringProperty).toBe('Not long enough!');
      });

      it('allows the message to depend on the value and model', () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: (value: string, model: TestType) => value.length === model.numberProperty,
          message: (value: string, model: TestType) =>
            `String property is ${value.length} characters long, but must be ${model.numberProperty} characters long`,
        };
        class OtherValidator extends Validator<TestType> {
          constructor() {
            {
              super();
              this.ruleFor('stringProperty').must(haveLengthEqualToTheNumberProperty);
            }
          }
        }
        const otherValidator = new OtherValidator();
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'Four',
          numberProperty: 10,
        };
        const result = otherValidator.validate(invalid);
        expect(result.stringProperty).toBe(
          'String property is 4 characters long, but must be 10 characters long',
        );
      });
    });

    describe('when passed an array of predicates and rule definitions', () => {
      const beNumeric = (value: string) => !isNaN(Number(value));
      const beAnInteger = {
        predicate: (value: string) => Number(value) % 1 === 0,
        message: 'Please enter a whole number',
      };
      const bePositive = {
        predicate: (value: string) => Number(value) > 0,
        message: (value: string) => `${value} is not a positive number`,
      };
      const bePositiveInteger = [beNumeric, beAnInteger, bePositive];

      class TestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must(bePositiveInteger);
        }
      }
      const validator = new TestValidator();

      it('gives a generic validation error if a predicate fails', () => {
        expect(
          validator.validate({ ...testInstance, stringProperty: 'notnumber' }).stringProperty,
        ).toBe('Value is not valid');
      });

      it('gives an appropriate validation error if a rule definition fails', () => {
        expect(validator.validate({ ...testInstance, stringProperty: '44.4' }).stringProperty).toBe(
          'Please enter a whole number',
        );

        expect(validator.validate({ ...testInstance, stringProperty: '-1' }).stringProperty).toBe(
          '-1 is not a positive number',
        );
      });

      it('does not give a validation error if the property is valid according to all rules', () => {
        expect(
          validator.validate({ ...testInstance, stringProperty: '44' }).stringProperty,
        ).toBeUndefined();
      });
    });
  });

  describe('setValidator', () => {
    class SubValidator extends Validator<SubType> {
      constructor() {
        super();
        this.ruleFor('nestedProperty').length(3, 5);
      }
    }
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableObjectProperty').setValidator(() => new SubValidator());
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the nested property is null', () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: null,
      };
      const result = validator.validate(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('does not give a validation error if the nested property is valid according to the validator', () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234',
        },
      };
      const result = validator.validate(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('gives a validation error if the nested property is invalid according to the validator', () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234567',
        },
      };
      const result = validator.validate(valid);
      expect(result.nullableObjectProperty).toEqual({
        nestedProperty: 'Value must be between 3 and 5 characters long',
      });
    });

    it('gives a type error if passed an incompatible validator', () => {
      type AnotherType = { anotherProperty: string };

      class AnotherValidator extends Validator<AnotherType> {
        constructor() {
          super();
          this.ruleFor('anotherProperty').maxLength(10);
        }
      }

      // @ts-ignore
      class AnotherTestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('objectProperty').setValidator(
            // @ts-expect-error
            () => new AnotherValidator(),
          );
        }
      }
    });
  });
});

type SubType = { nestedProperty: string };

type TestType = {
  stringProperty: string;
  nullableStringProperty: string | null;
  numberProperty: number;
  nullableNumberProperty: number | null;
  booleanProperty: boolean;
  nullableBooleanProperty: boolean | null;
  objectProperty: SubType;
  nullableObjectProperty: SubType | null;
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
