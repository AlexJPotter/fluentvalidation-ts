import { AsyncValidator } from '@/index';

describe('string validators (async)', () => {
  describe('notEmpty', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').notEmpty();
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the string is empty', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: '  ',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe('Value cannot be empty');
    });

    it('does not give a validation error if the string is not empty', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: 'Not empty',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the string is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).notEmpty();
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').notEmpty();

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').notEmpty();

          // @ts-expect-error
          this.ruleFor('booleanProperty').notEmpty();

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').notEmpty();

          // @ts-expect-error
          this.ruleFor('objectProperty').notEmpty();

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').notEmpty();
        }
      }
    });
  });

  describe('length', () => {
    const minLength = 10;
    const maxLength = 20;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').length(minLength, maxLength);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the string is too short', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'tooshort',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe(
        `Value must be between ${minLength} and ${maxLength} characters long`,
      );
    });

    it('gives a validation error if the string is too long', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'this string is much too long to pass validation',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe(
        `Value must be between ${minLength} and ${maxLength} characters long`,
      );
    });

    it('does not give a validation error if the string is an appropriate length', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: 'This length is OK',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the string is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).length(10, 20);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').length(5, 10);

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').length(5, 10);

          // @ts-expect-error
          this.ruleFor('booleanProperty').length(5, 10);

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').length(5, 10);

          // @ts-expect-error
          this.ruleFor('objectProperty').length(5, 10);

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').length(5, 10);
        }
      }
    });
  });

  describe('maxLength', () => {
    const maxLength = 10;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').maxLength(maxLength);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too long', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'This is far too long to pass validation',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe(
        `Value must be no more than ${maxLength} characters long`,
      );
    });

    it('does not give a validation error if the value does not exceed the max length', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: 'short',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).maxLength(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').maxLength(10);

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').maxLength(10);

          // @ts-expect-error
          this.ruleFor('booleanProperty').maxLength(10);

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').maxLength(10);

          // @ts-expect-error
          this.ruleFor('objectProperty').maxLength(10);

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').maxLength(10);
        }
      }
    });
  });

  describe('minLength', () => {
    const minLength = 10;
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').minLength(minLength);
      }
    }
    const validator = new TestValidator();

    it('gives a validation error if the value is too short', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'tooshort',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe(
        `Value must be at least ${minLength} characters long`,
      );
    });

    it('does not give a validation error if the value exceeds the min length', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: 'this is long enough',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).minLength(10);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').minLength(10);

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').minLength(10);

          // @ts-expect-error
          this.ruleFor('booleanProperty').minLength(10);

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').minLength(10);

          // @ts-expect-error
          this.ruleFor('objectProperty').minLength(10);

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').minLength(10);
        }
      }
    });
  });

  describe('emailAddress', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').emailAddress();
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the string is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the string is a valid email address', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: 'potter.alexander.james@gmail.com',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('gives a validation error if the string is not a valid email address', async () => {
      const invalid: TestType = {
        ...testInstance,
        nullableStringProperty: 'invalid@email',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.nullableStringProperty).toBe('Not a valid email address');
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).emailAddress();
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').emailAddress();

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').emailAddress();

          // @ts-expect-error
          this.ruleFor('booleanProperty').emailAddress();

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').emailAddress();

          // @ts-expect-error
          this.ruleFor('objectProperty').emailAddress();

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').emailAddress();
        }
      }
    });
  });

  describe('matches', () => {
    const pattern = new RegExp('^([0-9])+.([0-9]){2}$');
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('nullableStringProperty').matches(pattern);
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the value is null', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('does not give a validation error if the value matches the pattern', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: '10.44',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBeUndefined();
    });

    it('gives a validation error if the value does not match the pattern', async () => {
      const valid: TestType = {
        ...testInstance,
        nullableStringProperty: '0.4',
      };
      const result = await validator.validateAsync(valid);
      expect(result.nullableStringProperty).toBe('Value does not match the required pattern');
    });

    it('throws an error if it receives a non-string value', async () => {
      type OtherTestType = { age: number };
      class OtherTestTypeValidator extends AsyncValidator<OtherTestType> {
        constructor() {
          super();
          (this.ruleFor('age') as any).matches(pattern);
        }
      }
      const otherValidator = new OtherTestTypeValidator();

      try {
        await otherValidator.validateAsync({ age: 10 });
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(TypeError);
      }
    });

    it('cannot be used on non-string values', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // @ts-expect-error
          this.ruleFor('numberProperty').matches(pattern);

          // @ts-expect-error
          this.ruleFor('nullableNumberProperty').matches(pattern);

          // @ts-expect-error
          this.ruleFor('booleanProperty').matches(pattern);

          // @ts-expect-error
          this.ruleFor('nullableBooleanProperty').matches(pattern);

          // @ts-expect-error
          this.ruleFor('objectProperty').matches(pattern);

          // @ts-expect-error
          this.ruleFor('nullableObjectProperty').matches(pattern);
        }
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
