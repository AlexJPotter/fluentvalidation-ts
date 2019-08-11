import { Validator } from '../src/index';

describe('withMessage', () => {
  class TestValidator extends Validator<TestType> {
    constructor() {
      super();
      this.ruleFor('numberProperty')
        .must(numberProperty => numberProperty % 2 === 0)
        .withMessage('Must be even');
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
