import { AsyncValidator, Validator } from '@/index';

describe('unless', () => {
  describe('sync', () => {
    describe('if applied to all validators', () => {
      class TestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .unless((model) => model.booleanProperty, 'AppliesToAllValidators');
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if any rule fails and the condition is not met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: null,
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('does not give a validation error if the value is invalid and the condition is met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: null,
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });

      it('does not give a validation error if the value is valid and the condition is not met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: 'Valid',
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });

      it('does not give a validation error if the value is valid and the condition is met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: 'Valid',
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });
    });

    describe('if applied to all validators multiple times in the same chain', () => {
      it('applies each condition separately to the rules between the .unless calls', () => {
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleFor('nullableNumberProperty')
              .greaterThan(0)
              .unless((model) => model.stringProperty === 'Negative', 'AppliesToAllValidators')
              .lessThan(0)
              .unless((model) => model.stringProperty === 'Positive', 'AppliesToAllValidators');
          }
        }
        const validator = new TestValidator();

        expect(
          validator.validate({
            ...testInstance,
            stringProperty: 'Positive',
            nullableNumberProperty: 1,
          }),
        ).toEqual({});

        expect(
          validator.validate({
            ...testInstance,
            stringProperty: 'Positive',
            nullableNumberProperty: -1,
          }),
        ).toEqual({
          nullableNumberProperty: 'Value must be greater than 0',
        });

        expect(
          validator.validate({
            ...testInstance,
            stringProperty: 'Negative',
            nullableNumberProperty: -1,
          }),
        ).toEqual({});

        expect(
          validator.validate({
            ...testInstance,
            stringProperty: 'Negative',
            nullableNumberProperty: 1,
          }),
        ).toEqual({
          nullableNumberProperty: 'Value must be less than 0',
        });
      });
    });

    describe('if applied to only the current validator', () => {
      class TestValidator extends Validator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .unless((model) => model.booleanProperty, 'AppliesToCurrentValidator');
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if a different rule fails and the condition is met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: null,
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('gives a validation error if a different rule fails and the condition is not met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: null,
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('gives a validation error if the latest rule fails and the condition is not met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: '  ',
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be empty');
      });

      it('does not give a validation error if the latest rule fails and the condition is met', () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: ' ',
        };
        const result = validator.validate(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });
    });

    it('must come last in the rule definition', () => {
      // @ts-ignore
      class AnotherValidator extends Validator<TestType> {
        constructor() {
          super();

          // Valid
          this.ruleFor('stringProperty')
            .notEmpty()
            .withMessage('Please specify')
            .unless(() => true);

          // Not valid
          this.ruleFor('stringProperty')
            .notEmpty()
            .unless(() => true)
            // @ts-expect-error
            .withMessage('Please specify');

          // Not valid
          this.ruleFor('stringProperty')
            // @ts-expect-error
            .unless(() => true)
            .notEmpty()
            .withMessage('Please specify');
        }
      }
    });
  });

  describe('async', () => {
    describe('if applied to all validators', () => {
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .unless((model) => model.booleanProperty, 'AppliesToAllValidators');
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if any rule fails and the condition is not met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: null,
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('does not give a validation error if the value is invalid and the condition is met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: null,
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });

      it('does not give a validation error if the value is valid and the condition is not met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: 'Valid',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });

      it('does not give a validation error if the value is valid and the condition is met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: 'Valid',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });
    });

    describe('if applied to all validators multiple times in the same chain', () => {
      it('applies each condition separately to the rules between the .unless calls', async () => {
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleFor('nullableNumberProperty')
              .greaterThan(0)
              .unless((model) => model.stringProperty === 'Negative', 'AppliesToAllValidators')
              .lessThan(0)
              .unless((model) => model.stringProperty === 'Positive', 'AppliesToAllValidators');
          }
        }
        const validator = new TestValidator();

        expect(
          await validator.validateAsync({
            ...testInstance,
            stringProperty: 'Positive',
            nullableNumberProperty: 1,
          }),
        ).toEqual({});

        expect(
          await validator.validateAsync({
            ...testInstance,
            stringProperty: 'Positive',
            nullableNumberProperty: -1,
          }),
        ).toEqual({
          nullableNumberProperty: 'Value must be greater than 0',
        });

        expect(
          await validator.validateAsync({
            ...testInstance,
            stringProperty: 'Negative',
            nullableNumberProperty: -1,
          }),
        ).toEqual({});

        expect(
          await validator.validateAsync({
            ...testInstance,
            stringProperty: 'Negative',
            nullableNumberProperty: 1,
          }),
        ).toEqual({
          nullableNumberProperty: 'Value must be less than 0',
        });
      });
    });

    describe('if applied to only the current validator', () => {
      class TestValidator extends AsyncValidator<TestType> {
        constructor() {
          super();
          this.ruleFor('nullableStringProperty')
            .notNull()
            .notEmpty()
            .unless((model) => model.booleanProperty, 'AppliesToCurrentValidator');
        }
      }
      const validator = new TestValidator();

      it('gives a validation error if a different rule fails and the condition is met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: null,
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('gives a validation error if a different rule fails and the condition is not met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: null,
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be null');
      });

      it('gives a validation error if the latest rule fails and the condition is not met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: false,
          nullableStringProperty: '  ',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBe('Value cannot be empty');
      });

      it('does not give a validation error if the latest rule fails and the condition is met', async () => {
        const invalid = {
          ...testInstance,
          booleanProperty: true,
          nullableStringProperty: ' ',
        };
        const result = await validator.validateAsync(invalid);
        expect(result.nullableStringProperty).toBeUndefined();
      });
    });

    it('must come last in the rule definition', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestType> {
        constructor() {
          super();

          // Valid
          this.ruleFor('stringProperty')
            .notEmpty()
            .withMessage('Please specify')
            .unless(() => true);

          // Not valid
          this.ruleFor('stringProperty')
            .notEmpty()
            .unless(() => true)
            // @ts-expect-error
            .withMessage('Please specify');

          // Not valid
          this.ruleFor('stringProperty')
            // @ts-expect-error
            .unless(() => true)
            .notEmpty()
            .withMessage('Please specify');
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
