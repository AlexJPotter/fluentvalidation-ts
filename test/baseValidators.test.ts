import { Validator } from '../src/index';

describe('base validators', () => {
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
      expect(result).toEqual({ nullableStringProperty: 'Value must be null' });
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
  });

  describe('must', () => {
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('stringProperty').must(
          stringProperty => stringProperty.length > 10
        );
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
      const valid: TestType = { ...testInstance, stringProperty: 'Valid', numberProperty: 5 };
      const invalid: TestType = { ...testInstance, stringProperty: 'Invalid', numberProperty: 1 };
      expect(otherValidator.validate(valid).stringProperty).toBeUndefined();
      expect(otherValidator.validate(invalid).stringProperty).toBe('String property length must match number property value');
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
