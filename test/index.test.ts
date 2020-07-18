import { Validator, AsyncValidator } from '../src/index';

describe('index', () => {
  it('no rules (sync)', () => {
    type TestType = { name: string };
    class TestTypeValidator extends Validator<TestType> {
      constructor() {
        super();
      }
    }
    const validator = new TestTypeValidator();

    validator.validate({ name: 'Alex' });
  });

  it('no rules (async)', async () => {
    type TestType = { name: string };
    class TestTypeValidator extends AsyncValidator<TestType> {
      constructor() {
        super();
      }
    }
    const validator = new TestTypeValidator();

    await validator.validateAsync({ name: 'Alex' });
  });
});
