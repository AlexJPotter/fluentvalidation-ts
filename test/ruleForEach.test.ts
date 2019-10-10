import { Validator } from '../src/index';

describe('ruleForEach', () => {
  class TestValidator extends Validator<TestTypeWithArrayProperty> {
    constructor() {
      super();

      this.ruleFor('scores')
        .must(scores => scores == null || scores.length > 0)
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
    const invalid: TestTypeWithArrayProperty = { scores: [], otherProperty: 3 };
    const result = validator.validate(invalid);
    expect(result.scores).toBe('Must not be empty');
  });

  it('gives a validation error at each appropriate index if the value passes top level validation but some elements are invaid', () => {
    const invalid: TestTypeWithArrayProperty = {
      scores: [0, 20, 100, -10, 120],
      otherProperty: 5,
    };
    const result = validator.validate(invalid);
    expect(result).toEqual({
      scores: [
        null,
        null,
        null,
        'Must be between 0 and 100',
        'Must be between 0 and 100',
      ],
    });
  });
});

type TestTypeWithArrayProperty = {
  scores?: Array<number> | null;
  otherProperty: number;
};
