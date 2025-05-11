import { AsyncValidator, Validator } from '@/index';

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

    // @ts-expect-error
    validator.validate({ nonsense: true });
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

    // @ts-expect-error
    await validator.validateAsync({ nonsense: true });
  });
});
