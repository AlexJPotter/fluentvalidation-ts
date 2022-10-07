import { Validator, AsyncValidator } from '../src/index';

describe('withMessage', () => {
  const beAtLeastFiveCharactersLong = {
    predicate: (value: string) => value.length >= 5,
    message: 'Please enter at least 5 characters',
  };

  describe('sync', () => {
    class TestValidator extends Validator<TestType> {
      constructor() {
        super();
        this.ruleFor('numberProperty')
          .must((numberProperty) => numberProperty % 2 === 0)
          .withMessage('Must be even');
        this.ruleFor('stringProperty')
          .must(beAtLeastFiveCharactersLong)
          .withMessage('Too short!');
      }
    }
    const validator = new TestValidator();

    it('gives the provided validation error if the value is invalid', () => {
      const invalid: TestType = {
        ...testInstance,
        numberProperty: 13,
      };
      const result = validator.validate(invalid);
      expect(result.numberProperty).toBe('Must be even');
    });

    it('overrides custom messages defined for `must` rules', () => {
      const invalid: TestType = {
        ...testInstance,
        stringProperty: 'foo',
      };
      const result = validator.validate(invalid);
      expect(result.stringProperty).toBe('Too short!');
    });

    it('gives no validation error if the value is valid', () => {
      const valid: TestType = {
        ...testInstance,
        numberProperty: 12,
      };
      const result = validator.validate(valid);
      expect(result.numberProperty).toBeUndefined();
    });

    it('only applies to the latest rule in the chain', () => {
      class TestValidatorAlt extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .withMessage('Enter something!');
        }
      }
      const validatorAlt = new TestValidatorAlt();
      const invalidNull: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = validatorAlt.validate(invalidNull);
      expect(result.nullableStringProperty).toBe('Value cannot be null');
      const invalidEmpty: TestType = {
        ...testInstance,
        nullableStringProperty: '',
      };
      const otherResult = validatorAlt.validate(invalidEmpty);
      expect(otherResult.nullableStringProperty).toBe('Enter something!');
    });
  });

  describe('async', () => {
    class TestValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
        this.ruleFor('numberProperty')
          .must((numberProperty) => numberProperty % 2 === 0)
          .withMessage('Must be even');
        this.ruleFor('stringProperty')
          .must(beAtLeastFiveCharactersLong)
          .withMessage('Too short!');
      }
    }
    const validator = new TestValidator();

    it('gives the provided validation error if the value is invalid', async () => {
      const invalid: TestType = {
        ...testInstance,
        numberProperty: 13,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.numberProperty).toBe('Must be even');
    });

    it('overrides custom messages defined for `must` rules', async () => {
      const invalid: TestType = {
        ...testInstance,
        stringProperty: 'foo',
      };
      const result = await validator.validateAsync(invalid);
      expect(result.stringProperty).toBe('Too short!');
    });

    it('gives no validation error if the value is valid', async () => {
      const valid: TestType = {
        ...testInstance,
        numberProperty: 12,
      };
      const result = await validator.validateAsync(valid);
      expect(result.numberProperty).toBeUndefined();
    });

    it('only applies to the latest rule in the chain', async () => {
      class TestValidatorAlt extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .withMessage('Enter something!');
        }
      }
      const validatorAlt = new TestValidatorAlt();
      const invalidNull: TestType = {
        ...testInstance,
        nullableStringProperty: null,
      };
      const result = await validatorAlt.validateAsync(invalidNull);
      expect(result.nullableStringProperty).toBe('Value cannot be null');
      const invalidEmpty: TestType = {
        ...testInstance,
        nullableStringProperty: '',
      };
      const otherResult = await validatorAlt.validateAsync(invalidEmpty);
      expect(otherResult.nullableStringProperty).toBe('Enter something!');
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
