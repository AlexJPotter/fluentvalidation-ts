# FluentValidation

FluentValidation is a TypeScript-first library for building strongly-typed validation rules.

You can use FluentValidation to perform client-side validation on your forms, and back-end validation if you're running a Node API.

## Inspiration

FluentValidation has been heavily inspired by the popular [.NET library](https://fluentvalidation.net/) of the same name. It's an amazing library and I'd highly recommend you check it out if you need to add validation to a .NET application.

This library has also been designed with the popular React form library [Formik](https://github.com/jaredpalmer/formik) in mind. The validation result object that FluentValidation returns is compatible with the errors object that Formik expects, so you can start using FluentValidation to validate your Formik forms with very little effort. [This example](#with-formik) demonstrates just how easy it is.

## Requirements

This library has been written in, and for, TypeScript. You can still use FluentValidation without TypeScript, but the primary benefit of having strongly-typed validation rules is lost.

If using TypeScript (recommended), you must be on TypeScript version **2.9** or later.

## Installation

Using yarn:

```
yarn install fluentvalidation-ts
```

Using npm:

```
npm i --save fluentvalidation-ts
```

**Note:** FluentValidation has been written with first-class support for TypeScript, so there's no need to install types!

## Example Usage

```typescript
import { Validator } from 'fluentvalidation-ts';

type Person = {
  name: string;
  age: number;
};

class PersonValidator extends Validator<Person> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');

    this.ruleFor('age')
      .greaterThanOrEqualTo(0)
      .withMessage('Age cannot be negative');
  }
}

const validator = new PersonValidator();

validator.validate({ name: '', age: 25 });
// { name: 'Please enter your name' }

validator.validate({ name: 'Alex', age: -1 });
// { age: 'Age cannot be negative' }

validator.validate({ name: '', age: -1 });
// { name: 'Please enter your name', age: 'Age cannot be negative' }
```

## Documentation

[Validators](#validators)

- [`.emailAddress`](#emailaddress)
- [`.equal`](#equal)
- [`.exclusiveBetween`](#exclusivebetween)
- [`.greaterThanOrEqualTo`](#greaterthanorequalto)
- [`.greaterThan`](#greaterthan)
- [`.inclusiveBetween`](#inclusivebetween)
- [`.length`](#length)
- [`.lessThanOrEqualTo`](#lessthanorequalto)
- [`.lessThan`](#lessthan)
- [`.matches`](#matches)
- [`.maxLength`](#maxlength)
- [`.minLength`](#minlength)
- [`.must`](#must)
- [`.notEmpty`](#notempty)
- [`.notEqual`](#notequal)
- [`.notNull`](#notnull)
- [`.null`](#null)
- [`.scalePrecision`](#scaleprecision)
- [`.setValidator`](#setvalidator)

[Configuration](#configuration)

- [`.withMessage`](#withmessage)
- [`.when`](#when)
- [`.unless`](#unless)

[Examples](#examples)

- [Basic Usage](#basic-usage)
- [Custom Validators](#custom-validators)
- [Nested Types](#nested-types)
- [Recursive Types](#recursive-types)
- [Collections](#collections)
- [With Formik](#with-formik)

## Validators

FluentValidation comes with a number of built-in validators that cover most common validation you might wish to perform.

If you need to perform more detailed or complex validation, you can use the built-in [`.must`](#.must) validator to define your own custom validation rules.

### `.emailAddress`

Ensures that the value of the specified string property is a valid email address.

Example usage:

```typescript
this.ruleFor('customerEmail').emailAddress();
```

Example error:

```
Not a valid email address
```

### `.equal`

Ensures that the value of the specified property is equal to the given value. Note that this uses strict equality and will not work well with object or array values.

| Parameter         | Type                                                      | Description                                   |
| ----------------- | --------------------------------------------------------- | --------------------------------------------- |
| `comparisonValue` | `TValue` (generic type, matches the type of the property) | The value that the property must be equal to. |

Example usage:

```typescript
this.ruleFor('favouriteBand').equal('Arctic Monkeys');
```

Example error:

```
Must equal 'Arctic Monkeys'
```

### `.exclusiveBetween`

Ensures that the value of the specified number property is exclusively between the given bounds (i.e. greater than the lower bound and less than the upper bound).

| Parameter    | Type     | Description                                       |
| ------------ | -------- | ------------------------------------------------- |
| `lowerBound` | `number` | The value that the property must be greater than. |
| `upperBound` | `number` | The value that the property must be less than.    |

Example usage:

```typescript
this.ruleFor('age').exclusiveBetween(16, 25);
```

Example error:

```
Value must be between 16 and 25 (exclusive)
```

### `.greaterThanOrEqualTo`

Ensures that the value of the specified number property is greater than or equal to the given value.

| Parameter   | Type     | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------- |
| `threshold` | `number` | The value that the property must be greater than or equal to. |

Example usage:

```typescript
this.ruleFor('count').greaterThanOrEqualTo(0);
```

Example error:

```
Value must be greater than or equal to 0
```

### `.greaterThan`

Ensures that the value of the specified number property is greater than the given value.

| Parameter   | Type     | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `threshold` | `number` | The value that the property must be greater than. |

Example usage:

```typescript
this.ruleFor('year').greaterThan(1900);
```

Example error:

```
Value must be greater than 1,900
```

### `.inclusiveBetween`

Ensures that the value of the specified number property is inclusively between the given bounds (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

| Parameter    | Type     | Description                                                   |
| ------------ | -------- | ------------------------------------------------------------- |
| `lowerBound` | `number` | The value that the property must be greater than or equal to. |
| `upperBound` | `number` | The value that the property must be less than or equal to.    |

Example usage:

```typescript
this.ruleFor('percentage').inclusiveBetween(0, 100);
```

Example error:

```
Value must be between 0 and 100 (inclusive)
```

### `.length`

Ensures that the length of a particular string property is is inclusively between the given bounds (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

| Parameter   | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `minLength` | `number` | The minimum number of characters that the property can have. |
| `maxLength` | `number` | The maximum number of characters that the property can have. |

Example usage:

```typescript
this.ruleFor('password').length(8, 100);
```

Example error:

```
Value must be between 8 and 100 characters long
```

### `.lessThanOrEqualTo`

Ensures that the value of the specified number property is less than or equal to the given value.

| Parameter   | Type     | Description                                                |
| ----------- | -------- | ---------------------------------------------------------- |
| `threshold` | `number` | The value that the property must be less than or equal to. |

Example usage:

```typescript
this.ruleFor('weightInKg').lessThanOrEqualTo(1000);
```

Example error:

```
Value must be less than or equal to 1,000
```

### `.lessThan`

Ensures that the value of the specified number property is less than the given value.

| Parameter   | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `threshold` | `number` | The value that the property must be less than. |

Example usage:

```typescript
this.ruleFor('retryCount').lessThan(10);
```

Example error:

```
Value must be less than 10
```

### `.matches`

Ensures that the value of the specified string property matches the given regular expression.

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `pattern` | `RegExp` | A regular expression that the property must match. |

Example usage:

```typescript
this.ruleFor('price').matches(new RegExp('^([0-9])+.([0-9]){2}$'));
```

Example error:

```
Value does not match the required pattern
```

### `.maxLength`

Ensures that the length of a particular string property is less than or equal to the given value.

| Parameter   | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `maxLength` | `number` | The maximum number of characters that the property can have. |

Example usage:

```typescript
this.ruleFor('notes').maxLength(2000);
```

Example error:

```
Value must be no more than 2,000 characters long
```

### `.minLength`

Ensures that the length of a particular string property is greater than or equal to the given value.

| Parameter   | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `minLength` | `number` | The minimum number of characters that the property can have. |

Example usage:

```typescript
this.ruleFor('description').minLength(20);
```

Example error:

```
Value must be at least 20 characters long
```

### `.must`

Passes the value of the specified property into a delegate that can perform custom validation logic on the value.

| Parameter   | Type                                                                                                                                         | Description                                                                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition` | `(value: TValue, model: TModel) => boolean` (where `TValue` matches the type of the property, and `TModel` is the type of the parent object) | A function which takes the value of the property being validated (and the entire object being validated) and returns a `boolean` indicating whether or not the property is valid. |

Example usage:

```typescript
this.ruleFor('numberOfSocks').must(numberOfSocks => numberOfSocks % 2 === 0);
```

Note that the second parameter of the `condition` argument is an instance of the parent object being validated. This can be useful if you want to compare the current property with another property from inside the condition:

```typescript
this.ruleFor('yearsInCurrentJob').must(
  (yearsInCurrentJob, person) => yearsInCurrentJob < person.age
);
```

Example error:

```
Value is not valid
```

### `.notEmpty`

Ensures that the specified string property is not null, an empty string, or whitespace.

Example usage:

```typescript
this.ruleFor('name').notEmpty();
```

Example error:

```
Value cannot be empty
```

### `.notEqual`

Ensures that the value of the specified property is not equal to the given value. Note that this uses strict equality and will not work well with object or array values.

| Parameter         | Type                                                                      | Description                                       |
| ----------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| `comparisonValue` | `TValue` (generic type, matches the type of the property being validated) | The value that the property must not be equal to. |

Example usage:

```typescript
this.ruleFor('favouriteBand').notEqual('Coldplay');
```

Example error:

```
Value must not equal 'Coldplay'
```

### `.notNull`

Ensures that the value of the specified property is not null.

Example usage:

```typescript
this.ruleFor('lineManager').notNull();
```

Example error:

```
Value cannot be null
```

### `.null`

Ensures that the value of the specified property is null.

Example usage:

```typescript
this.ruleFor('children').null();
```

Example error:

```
Value must be null
```

### `.scalePrecision`

Ensures that the value of the specified number property has the given scale and precision.

| Parameter   | Type     | Description                                                                                                                    |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `precision` | `number` | The maximum number of digits after the decimal place that the value may have.                                                  |
| `scale`     | `number` | The total number of digits that the value may have (taking into account the number of digits allowed after the decimal place). |

Example usage:

```typescript
this.ruleFor('price').scalePrecision(2, 4);
```

In the above example the following would be valid:

```
0, 0.1, 0.01, 10, 10.1, 10.01
```

In the above example the following would be invalid:

```
0.001, 100
```

Example error:

```
Value must be no more than 4 digits in total, with allowance for 2 decimals
```

### `.setValidator`

Ensures that the value of the specified object property is valid according to the specified validator.

| Parameter           | Type                                                                                        | Description                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `validatorProducer` | `() => Validator<TValue>` (where `TValue` matches the type of the property being validated) | A function which returns a validator for validating the specified property. |

**Note:** The parameter here is a function in order to support recursive validation (see [this example](#recursive-types)).

Example usage:

```typescript
this.ruleFor('favouriteBand').setValidator(() => new BandValidator());
```

## Configuration

### `.withMessage`

You can override the default error message for a particular validator by calling the `.withMessage` method on the validator definition.

| Parameter       | Type     | Description                                       |
| --------------- | -------- | ------------------------------------------------- |
| `customMessage` | `string` | The custom message to use if the validator fails. |

**Note:** The custom error message only applies to the particular validator you call `.withMessage` on - it won't apply to validators earlier or later in the chain.

Example usage:

```typescript
this.ruleFor('name')
  .notEmpty()
  .withMessage('Please enter your name');
```

### `.when`

You can specify a condition to control when a rule should execute by calling the `.when` method on a validator definition.

| Parameter              | Type                                                                                    | Description                                                                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition`            | `(model: TModel) => boolean` (where `TModel` is the type of the object being validated) | A function which takes the model being validated and returns a `boolean` indicating whether the rule should execute.                                                                                               |
| `appliesTo` (optional) | `'AppliesToAllValidators' | 'AppliesToCurrentValidator'`                                | By default the condition applies to all validators in the chain so far (`'AppliesToAllValidators'`), but if you wish to apply the condition to an individual validator you can pass `'AppliesToCurrentValidator'`. |

Example usage:

```typescript
this.ruleFor('numberOfChildren')
  .notNull()
  .when(person => person.hasChildren);
```

### `.unless`

You can specify a condition to control when a rule should not execute by calling the `.unless` method on a validator definition.

| Parameter              | Type                                                                                    | Description                                                                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition`            | `(model: TModel) => boolean` (where `TModel` is the type of the object being validated) | A function which takes the model being validated and returns a `boolean` indicating whether the rule should not execute.                                                                                           |
| `appliesTo` (optional) | `'AppliesToAllValidators' | 'AppliesToCurrentValidator'`                                | By default the condition applies to all validators in the chain so far (`'AppliesToAllValidators'`), but if you wish to apply the condition to an individual validator you can pass `'AppliesToCurrentValidator'`. |

Example usage:

```typescript
this.ruleFor('hasPaid')
  .equal(true)
  .unless(customer => customer.getsFreeStuff);
```

## Examples

### Basic Usage

```typescript
import { Validator } from 'fluentvalidation-ts';

type Person = {
  name: string;
  age: number;
};

class PersonValidator extends Validator<Person> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');

    this.ruleFor('age')
      .greaterThanOrEqualTo(0)
      .withMessage('Age cannot be negative');
  }
}

const validator = new PersonValidator();

validator.validate({ name: '', age: 25 });
// { name: 'Please enter your name' }

validator.validate({ name: 'Alex', age: -1 });
// { age: 'Age cannot be negative' }

validator.validate({ name: '', age: -1 });
// { name: 'Please enter your name', age: 'Age cannot be negative' }
```

### Custom Validators

```typescript
import { Validator } from 'fluentvalidation-ts';

type ClothesPile = {
  numberOfSocks: number;
};

const beAnEvenInteger = (value: number) => value % 2 === 0;

class ClothesPileValidator extends Validator<ClothesPile> {
  constructor() {
    super();
    this.ruleFor('numberOfSocks')
      .must(beAnEvenInteger)
      .withMessage(`Can't have odd socks!`);
  }
}

const validator = new ClothesPileValidator();

validator.validate({ numberOfSocks: 3 });
// { numberOfSocks: `Can't have odd socks!` }
```

### Nested Types

```typescript
import { Validator } from 'fluentvalidation-ts';

type Album = {
  name: string;
  yearOfRelease: number;
};

class AlbumValidator extends Validator<Album> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty();

    this.ruleFor('yearOfRelease')
      .must(year => year % 1 === 0 && year >= 1900)
      .withMessage(
        'Year of release must be a whole number greater than or equal to 1900'
      );
  }
}

const albumValidator = new AlbumValidator();

type Artist = {
  name: string;
  debutAlbum: Album;
};

class ArtistValidator extends Validator<Artist> {
  constructor() {
    super();
    this.ruleFor('name').notEmpty();
    this.ruleFor('debutAlbum').setValidator(() => albumValidator);
  }
}

const artistValidator = new ArtistValidator();

artistValidator.validate({
  name: 'Arctic Monkeys',
  debutAlbum: {
    name: `Whatever People Say I Am, That's What I'm Not`,
    yearOfRelease: 0,
  },
});
// {
//   debutAlbum: {
//     yearOfRelease: 'Year of release must be a whole number greater than or equal to 1900'
//   }
// }
```

### Recursive Types

```typescript
import { Validator } from 'fluentvalidation-ts';

type Employee = {
  name: string;
  lineManager: Employee | null;
};

class EmployeeValidator extends Validator<Employee> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter a name');

    this.ruleFor('lineManager')
      .setValidator(() => new EmployeeValidator())
      .unless(employee => employee.lineManager == null);
  }
}

const validator = new EmployeeValidator();

validator.validate({
  name: 'Alex',
  lineManager: {
    name: '',
    lineManager: null,
  },
});
// { lineManager: { name: 'Please enter a name' } }
```

### Collections

```typescript
import { Validator } from 'fluentvalidation-ts';

type Results = {
  scores: Array<number>;
};

class ResultsValidator extends Validator<Results> {
  constructor() {
    super();

    this.ruleForEach('scores')
      .inclusiveBetween(0, 100)
      .withMessage('Score must be between 0 and 100');
  }
}

const validator = new ResultsValidator();

validator.validate({
  scores: [0, 14, 500];
});
// { scores: { 2: 'Score must be between 0 and 100' } }
```

### With Formik

```tsx
import * as React from 'react';
import { FormikProps, withFormik } from 'formik';
import { Validator } from 'fluentvalidation-ts';

type FormModel = { name: string };

type Props = FormikProps<FormModel>;

const MyFormComponent = (props: Props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        name="name"
      />
      {errors.name && touched.name && <div id="feedback">{errors.name}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();
    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');
  }
}

const formValidator = new FormValidator();

export const MyForm = withFormik({
  mapPropsToValues: () => ({ name: '' }),
  validate: formValues => formValidator.validate(formValues),
  handleSubmit: (values, { setSubmitting }) => {
    /* ...submit handler */
  },
})(MyForm);
```

## Test Coverage

FluentValidation has thorough test coverage via unit tests written with [Jest](https://jestjs.io/).

Coverage summary:

```
Statements   : 92.17% ( 400/434 )
Branches     : 90.66% ( 165/182 )
Functions    : 84.68% ( 105/124 )
Lines        : 91.56% ( 369/403 )
```

## Issues

Please report issues via GitHub.

## License

FluentValidation is provided under the terms of an [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

## About the Author

Alex Potter is a full-stack Software Developer who is currently part of the team at [Ghyston](https://www.ghyston.com), an award-winning software development company based in Bristol.

Get in touch [@ajp_dev](https://twitter.com/ajp_dev) on Twitter, or via [LinkedIn](www.linkedin.com/in/alex-james-potter).
