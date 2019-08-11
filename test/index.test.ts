import { Validator } from '../src/index';
describe('index', () => {
  it('no rules', () => {
    type TestType = { name: string };
    class TestTypeValidator extends Validator<TestType> {
      constructor() {
        super();
      }
    }
    const validator = new TestTypeValidator();

    validator.validate({ name: 'Alex' });
  });
});
