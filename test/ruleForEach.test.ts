import { delay } from './testHelpers';
import { AsyncValidator, Validator } from '@/index';

describe('ruleForEach', () => {
  describe('sync', () => {
    class TestValidator extends Validator<TestTypeWithArrayProperty> {
      constructor() {
        super();

        this.ruleFor('scores')
          .must((scores) => scores == null || scores.length > 0)
          .withMessage('Must not be empty');

        this.ruleForEach('scores')
          .inclusiveBetween(0, 100)
          .withMessage('Must be between 0 and 100');
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the value is null and passes top level validation', () => {
      const valid: TestTypeWithArrayProperty = {
        scores: null,
        otherProperty: 1,
      };
      const result = validator.validate(valid);
      expect(result.scores).toBeUndefined();
    });

    it('does not give a validation error if the value is undefined and passes top level validation', () => {
      const valid: TestTypeWithArrayProperty = {
        otherProperty: 1,
      };
      const result = validator.validate(valid);
      expect(result.scores).toBeUndefined();
    });

    it('does not give a validation error if the value passes top level validation and each element is valid', () => {
      const valid: TestTypeWithArrayProperty = {
        scores: [0, 50, 100],
        otherProperty: 1,
      };
      const result = validator.validate(valid);
      expect(result.scores).toBeUndefined();
    });

    it('gives a validation error if the value does not pass top level validation', () => {
      const invalid: TestTypeWithArrayProperty = {
        scores: [],
        otherProperty: 3,
      };
      const result = validator.validate(invalid);
      expect(result.scores).toBe('Must not be empty');
    });

    it('gives a validation error at each appropriate index if the value passes top level validation but some elements are invalid', () => {
      const invalid: TestTypeWithArrayProperty = {
        scores: [0, 20, 100, -10, 120],
        otherProperty: 5,
      };
      const result = validator.validate(invalid);
      expect(result).toEqual({
        scores: [null, null, null, 'Must be between 0 and 100', 'Must be between 0 and 100'],
      });
    });

    it('gives a type error if used on a non-array property', () => {
      // @ts-ignore
      class AnotherValidator extends Validator<TestTypeWithArrayProperty> {
        constructor() {
          super();
          // @ts-expect-error
          this.ruleForEach('otherProperty').null();
        }
      }
    });

    describe('when nested rules depend on the base model', () => {
      class DependentValidator extends Validator<TestTypeWithArrayProperty> {
        constructor() {
          super();

          this.ruleForEach('scores')
            .inclusiveBetween(0, 100)
            .withMessage('Must be between 0 and 100')
            .unless((model) => model.otherProperty === -1);
        }
      }
      const dependentValidator = new DependentValidator();

      it('gives a validation error if the base model is in an appropriate state', () => {
        const result = dependentValidator.validate({
          scores: [0, 10, -44, 100],
          otherProperty: 1,
        });

        expect(result).toEqual({
          scores: [null, null, 'Must be between 0 and 100', null],
        });
      });

      it('does not give a validation error if the base model is in an appropriate state', () => {
        const result = dependentValidator.validate({
          scores: [0, 10, -44, 100],
          otherProperty: -1,
        });

        expect(result).toEqual({});
      });
    });
  });

  describe('async', () => {
    class TestValidator extends AsyncValidator<TestTypeWithArrayProperty> {
      constructor() {
        super();

        this.ruleFor('scores')
          .must((scores) => scores == null || scores.length > 0)
          .withMessage('Must not be empty');

        this.ruleForEach('scores')
          .mustAsync(async (score) => {
            await delay(1);
            return score >= 0 && score <= 100;
          })
          .withMessage('Must be between 0 and 100');
      }
    }
    const validator = new TestValidator();

    it('does not give a validation error if the value is null and passes top level validation', async () => {
      const valid: TestTypeWithArrayProperty = {
        scores: null,
        otherProperty: 1,
      };
      const result = await validator.validateAsync(valid);
      expect(result.scores).toBeUndefined();
    });

    it('does not give a validation error if the value is undefined and passes top level validation', async () => {
      const valid: TestTypeWithArrayProperty = {
        otherProperty: 1,
      };
      const result = await validator.validateAsync(valid);
      expect(result.scores).toBeUndefined();
    });

    it('does not give a validation error if the value passes top level validation and each element is valid', async () => {
      const valid: TestTypeWithArrayProperty = {
        scores: [0, 50, 100],
        otherProperty: 1,
      };
      const result = await validator.validateAsync(valid);
      expect(result.scores).toBeUndefined();
    });

    it('gives a validation error if the value does not pass top level validation', async () => {
      const invalid: TestTypeWithArrayProperty = {
        scores: [],
        otherProperty: 3,
      };
      const result = await validator.validateAsync(invalid);
      expect(result.scores).toBe('Must not be empty');
    });

    it('gives a validation error at each appropriate index if the value passes top level validation but some elements are invalid', async () => {
      const invalid: TestTypeWithArrayProperty = {
        scores: [0, 20, 100, -10, 120],
        otherProperty: 5,
      };
      const result = await validator.validateAsync(invalid);
      expect(result).toEqual({
        scores: [null, null, null, 'Must be between 0 and 100', 'Must be between 0 and 100'],
      });
    });

    it('gives a type error if used on a non-array property', () => {
      // @ts-ignore
      class AnotherValidator extends AsyncValidator<TestTypeWithArrayProperty> {
        constructor() {
          super();
          // @ts-expect-error
          this.ruleForEach('otherProperty').null();
        }
      }
    });

    describe('when nested rules depend on the base model', () => {
      class DependentValidator extends AsyncValidator<TestTypeWithArrayProperty> {
        constructor() {
          super();

          this.ruleForEach('scores')
            .inclusiveBetween(0, 100)
            .withMessage('Must be between 0 and 100')
            .unless((model) => model.otherProperty === -1);
        }
      }
      const dependentValidator = new DependentValidator();

      it('gives a validation error if the base model is in an appropriate state', async () => {
        const result = await dependentValidator.validateAsync({
          scores: [0, 10, -44, 100],
          otherProperty: 1,
        });

        expect(result).toEqual({
          scores: [null, null, 'Must be between 0 and 100', null],
        });
      });

      it('does not give a validation error if the base model is in an appropriate state', async () => {
        const result = await dependentValidator.validateAsync({
          scores: [0, 10, -44, 100],
          otherProperty: -1,
        });

        expect(result).toEqual({});
      });
    });
  });
});

type TestTypeWithArrayProperty = {
  scores?: Array<number> | null;
  otherProperty: number;
};
