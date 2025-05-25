import { delay } from './testHelpers';
import { AsyncValidator, Validator } from '@/index';

describe('base validators (async)', () => {
  describe('notNull', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableNumberProperty').notNull();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is null', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableNumberProperty: null,
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({
        nullableNumberProperty: 'Value cannot be null',
      });
    });

    it('does not give a validation error if the value is not null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableNumberProperty: 44,
      };
      const result = await validator.validateAsync(valid);
      expect(result).toEqual({});
    });

    it('gives a validation error if no rule options have been passed and the value is undefined', async () => {
      class TestValidatorWithNoRuleOptions extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull();
        }
      }
      const validatorWithNoRuleOptions = new TestValidatorWithNoRuleOptions();
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithNoRuleOptions.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be null',
      });
    });

    it('gives a validation error if no rule options have been passed and the value is omitted', async () => {
      class TestValidatorWithNoRuleOptions extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull();
        }
      }
      const validatorWithNoRuleOptions = new TestValidatorWithNoRuleOptions();
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithNoRuleOptions.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be null',
      });
    });

    it('gives a validation error if the value is undefined and `includeUndefined` is true', async () => {
      class TestValidatorWithIncludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull({ includeUndefined: true });
        }
      }
      const validatorWithUndefined = new TestValidatorWithIncludeUndefined();
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithUndefined.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be null',
      });
    });

    it('gives a validation error if the value is omitted and `includeUndefined` is true', async () => {
      class TestValidatorWithIncludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull({ includeUndefined: true });
        }
      }
      const validatorWithUndefined = new TestValidatorWithIncludeUndefined();
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithUndefined.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be null',
      });
    });

    it('does not give a validation error if the value is undefined and `includeUndefined` is false', async () => {
      class TestValidatorWithExcludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull({ includeUndefined: false });
        }
      }
      const validatorWithUndefined = new TestValidatorWithExcludeUndefined();
      const valid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithUndefined.validateAsync(valid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if the value is omitted and `includeUndefined` is false', async () => {
      class TestValidatorWithExcludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').notNull({ includeUndefined: false });
        }
      }
      const validatorWithUndefined = new TestValidatorWithExcludeUndefined();
      const valid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithUndefined.validateAsync(valid);
      expect(result).toEqual({});
    });
  });

  describe('notUndefined', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('optionalStringProperty').notUndefined();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is undefined', async () => {
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be undefined',
      });
    });

    it('gives a validation error if the value is omitted', async () => {
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({
        optionalStringProperty: 'Value cannot be undefined',
      });
    });

    it('does not give a validation error if the value is not undefined', async () => {
      const valid: TestType = {
        ...testInstance,
        optionalStringProperty: 'Test',
      };
      const result = await validator.validateAsync(valid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        optionalStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result).toEqual({});
    });
  });

  describe('null', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').null();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not null', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'Not null',
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({
        nullableStringProperty: 'Value must be null',
      });
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if no rule options have been passed and the value is undefined', async () => {
      class TestValidatorWithNoRuleOptions extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null();
        }
      }
      const validatorWithNoRuleOptions = new TestValidatorWithNoRuleOptions();
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithNoRuleOptions.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if no rule options have been passed and the value is omitted', async () => {
      class TestValidatorWithNoRuleOptions extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null();
        }
      }
      const validatorWithNoRuleOptions = new TestValidatorWithNoRuleOptions();
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithNoRuleOptions.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if the value is undefined and `includeUndefined` is true', async () => {
      class TestValidatorWithIncludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null({ includeUndefined: true });
        }
      }
      const validatorWithUndefined = new TestValidatorWithIncludeUndefined();
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithUndefined.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if the value is omitted and `includeUndefined` is true', async () => {
      class TestValidatorWithIncludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null({ includeUndefined: true });
        }
      }
      const validatorWithUndefined = new TestValidatorWithIncludeUndefined();
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithUndefined.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('gives a validation error if the value is undefined and `includeUndefined` is false', async () => {
      class TestValidatorWithExcludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null({ includeUndefined: false });
        }
      }
      const validatorWithUndefined = new TestValidatorWithExcludeUndefined();
      const valid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validatorWithUndefined.validateAsync(valid);
      expect(result).toEqual({
        optionalStringProperty: 'Value must be null',
      });
    });

    it('gives a validation error if the value is omitted and `includeUndefined` is false', async () => {
      class TestValidatorWithExcludeUndefined extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('optionalStringProperty').null({ includeUndefined: false });
        }
      }
      const validatorWithUndefined = new TestValidatorWithExcludeUndefined();
      const valid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validatorWithUndefined.validateAsync(valid);
      expect(result).toEqual({
        optionalStringProperty: 'Value must be null',
      });
    });
  });

  describe('undefined', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('optionalStringProperty').undefined();
      }
    }

    const validator = new TestValidator();

    it('does not give a validation error if the value is undefined', async () => {
      const invalid: TestType = {
        ...testInstance,
        optionalStringProperty: undefined,
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('does not give a validation error if the value is omitted', async () => {
      const invalid: TestType = {
        ...testInstance,
        // optionalStringProperty is omitted
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({});
    });

    it('gives a validation error if the value is not undefined', async () => {
      const valid: TestType = {
        ...testInstance,
        optionalStringProperty: 'Test',
      };
      const result = await validator.validateAsync(valid);
      expect(result).toEqual({
        optionalStringProperty: 'Value must be undefined',
      });
    });
  });

  describe('notEqual', () => {
    const forbiddenValue = 'Forbidden';
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('stringProperty').notEqual(forbiddenValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is equal to the forbidden value', async () => {
      const invalid: TestType = {
        ...testInstance,
        stringProperty: forbiddenValue,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.stringProperty).toBe(`Must not equal '${forbiddenValue}'`);
    });

    it('does not give a validation error if the value is not equal to the forbidden value', async () => {
      const valid: TestType = {
        ...testInstance,
        stringProperty: `Not ${forbiddenValue}`,
      };
      const result = await validator.validateAsync(valid);
      expect(result.stringProperty).toBeUndefined();
    });

    it('gives a type error if the comparison value is of the wrong type', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
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
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('numberProperty').equal(requiredValue);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is not equal to the required value', async () => {
      const invalid: TestType = {
        ...testInstance,
        numberProperty: 2019,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.numberProperty).toBe(`Must equal '44'`);
    });

    it('does not give a validation error if the value is equal to the required value', async () => {
      const valid: TestType = {
        ...testInstance,
        numberProperty: requiredValue,
      };
      const result = await validator.validateAsync(valid);
      expect(result.numberProperty).toBeUndefined();
    });

    it('gives a type error if the comparison value is of the wrong type', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
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
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must((stringProperty) => stringProperty.length > 10);
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if the predicate is not met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Value is not valid');
      });

      it('does not give a validation error if the predicate is met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', async () => {
        class OtherValidator extends AsyncValidator<TestType> {
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
        expect((await otherValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await otherValidator.validateAsync(invalid)).stringProperty).toBe(
          'String property length must match number property value',
        );
      });
    });

    describe('when passed a rule definition', () => {
      const beAtLeastTenCharactersLong = {
        predicate: (value: string) => value.length >= 10,
        message: 'Please enter at least 10 characters',
      };
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must(beAtLeastTenCharactersLong);
        }
      }
      const validator = new TestValidator();

      it('gives a validation error with the specified message if the predicate is not met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Please enter at least 10 characters');
      });

      it('does not give a validation error if the predicate is met', async () => {
        const valid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = await validator.validateAsync(valid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', async () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: (value: string, model: TestType) => value.length === model.numberProperty,
          message: 'String property length must match number property value',
        };
        class OtherValidator extends AsyncValidator<TestType> {
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
        expect((await otherValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await otherValidator.validateAsync(invalid)).stringProperty).toBe(
          'String property length must match number property value',
        );
      });

      it('still allows the message to be overridden', async () => {
        class OtherValidator extends AsyncValidator<TestType> {
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
        const result = await otherValidator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Not long enough!');
      });

      it('allows the message to depend on the value and model', async () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: (value: string, model: TestType) => value.length === model.numberProperty,
          message: (value: string, model: TestType) =>
            `String property is ${value.length} characters long, but must be ${model.numberProperty} characters long`,
        };
        class OtherValidator extends AsyncValidator<TestType> {
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
        const result = await otherValidator.validateAsync(invalid);
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

      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').must(bePositiveInteger);
        }
      }
      const validator = new TestValidator();

      it('gives a generic validation error if a predicate fails', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: 'notnumber',
            })
          ).stringProperty,
        ).toBe('Value is not valid');
      });

      it('gives an appropriate validation error if a rule definition fails', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '44.4',
            })
          ).stringProperty,
        ).toBe('Please enter a whole number');

        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '-1',
            })
          ).stringProperty,
        ).toBe('-1 is not a positive number');
      });

      it('does not give a validation error if the property is valid according to all rules', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '44',
            })
          ).stringProperty,
        ).toBeUndefined();
      });
    });
  });

  describe('mustAsync', () => {
    describe('when passed a predicate', () => {
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').mustAsync(async (stringProperty) => {
            await delay(1);
            return stringProperty.length > 10;
          });
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if the predicate is not met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Value is not valid');
      });

      it('does not give a validation error if the predicate is met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', async () => {
        class OtherValidator extends AsyncValidator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty')
              .mustAsync(async (value, model) => {
                await delay(1);
                return value.length === model.numberProperty;
              })
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
        expect((await otherValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await otherValidator.validateAsync(invalid)).stringProperty).toBe(
          'String property length must match number property value',
        );
      });

      it('can be chained', async () => {
        class ChainedValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleFor('stringProperty')
              .mustAsync(async (stringProperty) => {
                await delay(1);
                return stringProperty.length > 1;
              })
              .withMessage('Must be longer than 1 character')
              .mustAsync(async (stringProperty) => {
                await delay(1);
                return stringProperty.length < 3;
              })
              .withMessage('Must be shorter than 3 characters');
          }
        }
        const chainedValidator = new ChainedValidator();
        const valid: TestType = {
          ...testInstance,
          stringProperty: '12',
        };
        const invalid: TestType = {
          ...testInstance,
          stringProperty: '123',
        };
        expect((await chainedValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await chainedValidator.validateAsync(invalid)).stringProperty).toBe(
          'Must be shorter than 3 characters',
        );
      });
    });

    describe('when passed a rule definition', () => {
      const beAtLeastTenCharactersLong = {
        predicate: async (value: string) => {
          await delay(1);
          return value.length >= 10;
        },
        message: 'Please enter at least 10 characters',
      };
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').mustAsync(beAtLeastTenCharactersLong);
        }
      }
      const validator = new TestValidator();

      it('gives a validation error with the specified message if the predicate is not met', async () => {
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Please enter at least 10 characters');
      });

      it('does not give a validation error if the predicate is met', async () => {
        const valid: TestType = {
          ...testInstance,
          stringProperty: 'long enough',
        };
        const result = await validator.validateAsync(valid);
        expect(result.stringProperty).toBeUndefined();
      });

      it('accepts a predicate which relies on the base model', async () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: async (value: string, model: TestType) => {
            await delay(1);
            return value.length === model.numberProperty;
          },
          message: 'String property length must match number property value',
        };
        class OtherValidator extends AsyncValidator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty').mustAsync(haveLengthEqualToTheNumberProperty);
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
        expect((await otherValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await otherValidator.validateAsync(invalid)).stringProperty).toBe(
          'String property length must match number property value',
        );
      });

      it('still allows the message to be overridden', async () => {
        class OtherValidator extends AsyncValidator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty')
              .mustAsync(beAtLeastTenCharactersLong)
              .withMessage('Not long enough!');
          }
        }
        const otherValidator = new OtherValidator();
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'tooshort',
        };
        const result = await otherValidator.validateAsync(invalid);
        expect(result.stringProperty).toBe('Not long enough!');
      });

      it('allows the message to depend on the value and model', async () => {
        const haveLengthEqualToTheNumberProperty = {
          predicate: async (value: string, model: TestType) => {
            await delay(1);
            return value.length === model.numberProperty;
          },
          message: (value: string, model: TestType) =>
            `String property is ${value.length} characters long, but must be ${model.numberProperty} characters long`,
        };
        class OtherValidator extends AsyncValidator<TestType> {
          constructor() {
            {
              super();
              this.ruleFor('stringProperty').mustAsync(haveLengthEqualToTheNumberProperty);
            }
          }
        }
        const otherValidator = new OtherValidator();
        const invalid: TestType = {
          ...testInstance,
          stringProperty: 'Four',
          numberProperty: 10,
        };
        const result = await otherValidator.validateAsync(invalid);
        expect(result.stringProperty).toBe(
          'String property is 4 characters long, but must be 10 characters long',
        );
      });

      it('can be chained', async () => {
        const beNoMoreThanTwelveCharactersLong = {
          predicate: async (value: string) => {
            await delay(1);
            return value.length <= 12;
          },
          message: 'Please enter no more than 12 characters',
        };
        class ChainedValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleFor('stringProperty')
              .mustAsync(beAtLeastTenCharactersLong)
              .mustAsync(beNoMoreThanTwelveCharactersLong);
          }
        }
        const chainedValidator = new ChainedValidator();
        const valid: TestType = {
          ...testInstance,
          stringProperty: '123456789A',
        };
        const invalid: TestType = {
          ...testInstance,
          stringProperty: '123456789ABCD',
        };
        expect((await chainedValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await chainedValidator.validateAsync(invalid)).stringProperty).toBe(
          'Please enter no more than 12 characters',
        );
      });
    });

    describe('when passed an array of predicates and rule definitions', () => {
      const beNumeric = async (value: string) => {
        await delay(1);
        return !isNaN(Number(value));
      };
      const beAnInteger = {
        predicate: async (value: string) => {
          await delay(1);
          return Number(value) % 1 === 0;
        },
        message: 'Please enter a whole number',
      };
      const bePositive = {
        predicate: async (value: string) => {
          await delay(1);
          return Number(value) > 0;
        },
        message: (value: string) => `${value} is not a positive number`,
      };
      const bePositiveInteger = [beNumeric, beAnInteger, bePositive];

      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('stringProperty').mustAsync(bePositiveInteger);
        }
      }
      const validator = new TestValidator();

      it('gives a generic validation error if a predicate fails', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: 'notnumber',
            })
          ).stringProperty,
        ).toBe('Value is not valid');
      });

      it('gives an appropriate validation error if a rule definition fails', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '44.4',
            })
          ).stringProperty,
        ).toBe('Please enter a whole number');

        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '-1',
            })
          ).stringProperty,
        ).toBe('-1 is not a positive number');
      });

      it('does not give a validation error if the property is valid according to all rules', async () => {
        expect(
          (
            await validator.validateAsync({
              ...testInstance,
              stringProperty: '44',
            })
          ).stringProperty,
        ).toBeUndefined();
      });

      it('can be chained', async () => {
        const beLessThanFive = {
          predicate: async (value: string) => {
            await delay(1);
            return Number(value) < 5;
          },
          message: (value: string) => `${value} is not less than 5`,
        };
        class ChainedValidator extends AsyncValidator<TestType> {
          constructor() {
            super();
            this.ruleFor('stringProperty').mustAsync(bePositiveInteger).mustAsync(beLessThanFive);
          }
        }
        const chainedValidator = new ChainedValidator();
        const valid: TestType = {
          ...testInstance,
          stringProperty: '3',
        };
        const invalid: TestType = {
          ...testInstance,
          stringProperty: '6',
        };
        expect((await chainedValidator.validateAsync(valid)).stringProperty).toBeUndefined();
        expect((await chainedValidator.validateAsync(invalid)).stringProperty).toBe(
          '6 is not less than 5',
        );
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
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableObjectProperty').setValidator(() => new SubValidator());
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the nested property is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('does not give a validation error if the nested property is valid according to the validator', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234',
        },
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('gives a validation error if the nested property is invalid according to the validator', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234567',
        },
      };
      const result = await validator.validateAsync(valid);
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
      class AnotherTestValidator extends AsyncValidator<TestType> {
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

  describe('setAsyncValidator', () => {
    class SubValidator extends AsyncValidator<SubType> {
      constructor() {
        super();
        this.ruleFor('nestedProperty').length(3, 5);
      }
    }
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableObjectProperty').setAsyncValidator(() => new SubValidator());
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the nested property is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('does not give a validation error if the nested property is valid according to the validator', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234',
        },
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableObjectProperty).toBeUndefined();
    });

    it('gives a validation error if the nested property is invalid according to the validator', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableObjectProperty: {
          nestedProperty: '1234567',
        },
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableObjectProperty).toEqual({
        nestedProperty: 'Value must be between 3 and 5 characters long',
      });
    });

    it('gives a type error if passed an incompatible validator', () => {
      type AnotherType = { anotherProperty: string };

      class AnotherValidator extends AsyncValidator<AnotherType> {
        constructor() {
          super();
          this.ruleFor('anotherProperty').maxLength(10);
        }
      }

      // @ts-ignore
      class AnotherTestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('objectProperty').setAsyncValidator(
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
  optionalStringProperty?: string | null;
  numberProperty: number;
  nullableNumberProperty: number | null;
  booleanProperty: boolean;
  nullableBooleanProperty: boolean | null;
  objectProperty: SubType;
  nullableObjectProperty: SubType | null;
  optionalObjectProperty?: SubType | null;
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
