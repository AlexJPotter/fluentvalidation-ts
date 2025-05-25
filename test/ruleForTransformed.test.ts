import { AsyncValidator, Validator } from '@/index';

describe('ruleForTransformed', () => {
  describe('sync', () => {
    describe('flat type', () => {
      type TestType = { stringProperty: string };

      it('can be transformed to another flat type', () => {
        const tryParseAsNumber = (value: string): number | null =>
          isNaN(Number(value)) ? null : Number(value);

        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('stringProperty', tryParseAsNumber)
              .notNull()
              .withMessage('Not a number')
              .greaterThan(0)
              .withMessage('Must be strictly positive');
          }
        }

        const testValidator = new TestValidator();

        const invalid = testValidator.validate({ stringProperty: '-23' });
        expect(invalid.stringProperty).toBe('Must be strictly positive');

        const valid = testValidator.validate({ stringProperty: '4' });
        expect(valid).toEqual({});
      });

      it('cannot be transformed to an array type', () => {
        const mapToArray = (value: string): Array<string> => [value];

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'stringProperty',
              // @ts-expect-error
              mapToArray,
            ).notNull();
          }
        }
      });

      it('cannot be transformed to an object type', () => {
        const mapToObject = (value: string): object => ({ foo: value });

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'stringProperty',
              // @ts-expect-error
              mapToObject,
            ).notNull();
          }
        }
      });
    });

    describe('array type', () => {
      type TestType = { arrayProperty: Array<string> };

      it('can be transformed to a flat type', () => {
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', (a) => a.length)
              .equal(3)
              .withMessage('Must contain 3 elements');
          }
        }

        const testValidator = new TestValidator();

        const invalid = testValidator.validate({
          arrayProperty: ['1', '2', '3', '4'],
        });

        expect(invalid.arrayProperty).toBe('Must contain 3 elements');

        const valid = testValidator.validate({
          arrayProperty: ['1', '2', '3'],
        });

        expect(valid).toEqual({});
      });

      it('can be transformed to an array of the same type', () => {
        const addFooToEachElement = (value: Array<string>): Array<string> =>
          value.map((x) => 'foo' + x);

        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', addFooToEachElement)
              .must((values) => values[0] === 'foo1')
              .withMessage('First element must be 1');
          }
        }

        const testValidator = new TestValidator();

        const invalid = testValidator.validate({
          arrayProperty: ['2', '3', '4'],
        });

        expect(invalid.arrayProperty).toBe('First element must be 1');
      });

      it('cannot be transformed to an array of a different type', () => {
        // actually, maybe you should be able to do this?
        // todo - come back to this

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', (a) =>
              // @ts-expect-error
              a.map((x) => Number(x)),
            ).notNull();
          }
        }
      });

      it('cannot be transformed to an object type', () => {
        const mapToObject = (value: Array<string>) => ({
          itemCount: value.length,
        });

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'arrayProperty',
              // @ts-expect-error
              mapToObject,
            ).notNull();
          }
        }
      });
    });

    describe('object type', () => {
      type TestType = {
        objectProperty: NestedType;
      };

      type NestedType = {
        stringProperty: string;
      };

      it('can be transformed to a flat type', () => {
        const getNestedProperty = (value: NestedType) => value.stringProperty;

        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('objectProperty', getNestedProperty)
              .notEmpty()
              .equal('Foo')
              .withMessage('Must equal Foo');
          }
        }

        const testValidator = new TestValidator();

        const invalid = testValidator.validate({
          objectProperty: {
            stringProperty: 'Bar',
          },
        });

        expect(typeof invalid.objectProperty).toBe('string');
        expect(invalid.objectProperty).toBe('Must equal Foo');

        const valid = testValidator.validate({
          objectProperty: {
            stringProperty: 'Foo',
          },
        });

        expect(valid).toEqual({});
      });

      it('can be transformed to an object of the same type', () => {
        const addFooToNestedProperty = (value: NestedType): NestedType => ({
          stringProperty: 'foo' + value.stringProperty,
        });

        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('objectProperty', addFooToNestedProperty)
              .must((x) => x.stringProperty === 'foobar')
              .withMessage('Must give foobar');
          }
        }

        const testValidator = new TestValidator();

        const invalid = testValidator.validate({
          objectProperty: {
            stringProperty: 'baz',
          },
        });

        expect(invalid.objectProperty).toBe('Must give foobar');

        const valid = testValidator.validate({
          objectProperty: {
            stringProperty: 'bar',
          },
        });

        expect(valid).toEqual({});
      });

      it('cannot be transformed to an object of a different type', () => {
        const transform = (value: NestedType) => ({
          ...value,
          newProperty: 'test',
        });

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'objectProperty',
              // @ts-expect-error
              transform,
            ).must((x) => x.newProperty === 'whatever');
          }
        }
      });

      it('cannot be transformed to an array type', () => {
        const transformToArray = (value: NestedType) => [value.stringProperty];

        // @ts-ignore
        class TestValidator extends Validator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'objectProperty',
              // @ts-expect-error
              transformToArray,
            ).notNull();
          }
        }
      });
    });
  });

  describe('async', () => {
    describe('flat type', () => {
      type TestType = { stringProperty: string };

      it('can be transformed to another flat type', async () => {
        const tryParseAsNumber = (value: string): number | null =>
          isNaN(Number(value)) ? null : Number(value);

        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('stringProperty', tryParseAsNumber)
              .notNull()
              .withMessage('Not a number')
              .greaterThan(0)
              .withMessage('Must be strictly positive');
          }
        }

        const testValidator = new TestValidator();

        const invalid = await testValidator.validateAsync({
          stringProperty: '-23',
        });
        expect(invalid.stringProperty).toBe('Must be strictly positive');

        const valid = await testValidator.validateAsync({
          stringProperty: '4',
        });
        expect(valid).toEqual({});
      });

      it('cannot be transformed to an array type', () => {
        const mapToArray = (value: string): Array<string> => [value];

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'stringProperty',
              // @ts-expect-error
              mapToArray,
            ).notNull();
          }
        }
      });

      it('cannot be transformed to an object type', () => {
        const mapToObject = (value: string): object => ({ foo: value });

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'stringProperty',
              // @ts-expect-error
              mapToObject,
            ).notNull();
          }
        }
      });
    });

    describe('array type', () => {
      type TestType = { arrayProperty: Array<string> };

      it('can be transformed to a flat type', async () => {
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', (a) => a.length)
              .equal(3)
              .withMessage('Must contain 3 elements');
          }
        }

        const testValidator = new TestValidator();

        const invalid = await testValidator.validateAsync({
          arrayProperty: ['1', '2', '3', '4'],
        });

        expect(invalid.arrayProperty).toBe('Must contain 3 elements');

        const valid = await testValidator.validateAsync({
          arrayProperty: ['1', '2', '3'],
        });

        expect(valid).toEqual({});
      });

      it('can be transformed to an array of the same type', async () => {
        const addFooToEachElement = (value: Array<string>): Array<string> =>
          value.map((x) => 'foo' + x);

        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', addFooToEachElement)
              .must((values) => values[0] === 'foo1')
              .withMessage('First element must be 1');
          }
        }

        const testValidator = new TestValidator();

        const invalid = await testValidator.validateAsync({
          arrayProperty: ['2', '3', '4'],
        });

        expect(invalid.arrayProperty).toBe('First element must be 1');
      });

      it('cannot be transformed to an array of a different type', () => {
        // actually, maybe you should be able to do this?
        // todo - come back to this

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('arrayProperty', (a) =>
              // @ts-expect-error
              a.map((x) => Number(x)),
            ).notNull();
          }
        }
      });

      it('cannot be transformed to an object type', () => {
        const mapToObject = (value: Array<string>) => ({
          itemCount: value.length,
        });

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'arrayProperty',
              // @ts-expect-error
              mapToObject,
            ).notNull();
          }
        }
      });
    });

    describe('object type', () => {
      type TestType = {
        objectProperty: NestedType;
      };

      type NestedType = {
        stringProperty: string;
      };

      it('can be transformed to a flat type', async () => {
        const getNestedProperty = (value: NestedType) => value.stringProperty;

        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('objectProperty', getNestedProperty)
              .notEmpty()
              .equal('Foo')
              .withMessage('Must equal Foo');
          }
        }

        const testValidator = new TestValidator();

        const invalid = await testValidator.validateAsync({
          objectProperty: {
            stringProperty: 'Bar',
          },
        });

        expect(typeof invalid.objectProperty).toBe('string');
        expect(invalid.objectProperty).toBe('Must equal Foo');

        const valid = await testValidator.validateAsync({
          objectProperty: {
            stringProperty: 'Foo',
          },
        });

        expect(valid).toEqual({});
      });

      it('can be transformed to an object of the same type', async () => {
        const addFooToNestedProperty = (value: NestedType): NestedType => ({
          stringProperty: 'foo' + value.stringProperty,
        });

        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed('objectProperty', addFooToNestedProperty)
              .must((x) => x.stringProperty === 'foobar')
              .withMessage('Must give foobar');
          }
        }

        const testValidator = new TestValidator();

        const invalid = await testValidator.validateAsync({
          objectProperty: {
            stringProperty: 'baz',
          },
        });

        expect(invalid.objectProperty).toBe('Must give foobar');

        const valid = await testValidator.validateAsync({
          objectProperty: {
            stringProperty: 'bar',
          },
        });

        expect(valid).toEqual({});
      });

      it('cannot be transformed to an object of a different type', () => {
        const transform = (value: NestedType) => ({
          ...value,
          newProperty: 'test',
        });

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            // @ts-expect-error
            this.ruleForTransformed('objectProperty', transform).must(
              (x) => x.newProperty === 'whatever',
            );
          }
        }
      });

      it('cannot be transformed to an array type', () => {
        const transformToArray = (value: NestedType) => [value.stringProperty];

        // @ts-ignore
        class TestValidator extends AsyncValidator<TestType> {
          constructor() {
            super();

            this.ruleForTransformed(
              'objectProperty',
              // @ts-expect-error
              transformToArray,
            ).notNull();
          }
        }
      });
    });
  });
});
