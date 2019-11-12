<div align="center">
<h1>fluentvalidation-ts</h1>

<img
    height="150"
    width="150"
    alt="Logo."
    src="https://raw.githubusercontent.com/AlexJPotter/fluentvalidation-ts/master/logo.png"
  />

</div>

![Coverage](https://badgen.net/badge/coverage/100%25/green)
[![NPM Version](https://badgen.net/npm/v/fluentvalidation-ts)](https://www.npmjs.com/package/fluentvalidation-ts)
![License](https://badgen.net/npm/license/fluentvalidation-ts)
![Last Commit](https://badgen.net/github/last-commit/alexjpotter/fluentvalidation-ts/master)
![Open Issues](https://badgen.net/github/open-issues/alexjpotter/fluentvalidation-ts)

![Dependencies](https://badgen.net/badge/dependencies/none/green)
[![GZIP Size](http://img.badgesize.io/https://unpkg.com/fluentvalidation-ts@latest/dist/fluentvalidation-ts.umd.production.min.js?compression=gzip)](https://unpkg.com/fluentvalidation-ts@latest/dist/fluentvalidation-ts.umd.production.min.js)

<hr />

`fluentvalidation-ts` is a TypeScript-first library for building strongly-typed validation rules.

You can use `fluentvalidation-ts` to perform client-side validation on your forms, and back-end validation if you're running a Node API.

## Table of Contents

- [Motivation](#motivation)
- [Requirements](#requirements)
- [Installation](#installation)
- [Example Usage](#example-usage)
- [Documentation](#documentation)
- [Examples](#examples)
- [Test Coverage](#test-coverage)
- [Issues](#issues)
- [License](#license)
- [About the Author](#about-the-author)

## Motivation

Validation is a very common problem in front-end development, and the requirements range from very basic to very complex. I've always felt that there aren't many libraries offering a good solution to problem of front-end validation, and those that do exist I've found lacking in certain areas (most notably TypeScript support).

If you've ever worked on a .NET API, you might have heard of a library called [FluentValidation](https://fluentvalidation.net/). It has a really nice API for building up validation rules, and that made me wonder whether I could achieve something similar in TypeScript. This led me to write `fluentvalidation-ts`, and though it's not a direct port of FluentValidation it will still feel very familiar to anyone who's used FluentValidation before.

Another large factor in the design of `fluentvalidation-ts` was the popular React form library [Formik](https://github.com/jaredpalmer/formik). The validation result object that `fluentvalidation-ts` returns is compatible with the errors object that Formik expects, so you can start using `fluentvalidation-ts` to validate your Formik forms and it "just works". [This example](#with-formik) demonstrates just how easy it is.

## Requirements

This library has been written in, and for, TypeScript. You can still use `fluentvalidation-ts` without TypeScript, but the primary benefit of having strongly-typed validation rules is lost.

If using TypeScript (recommended), you must be on TypeScript version **2.9** or later.

## Installation

Using yarn:

```
yarn add fluentvalidation-ts
```

Using npm:

```
npm i --save fluentvalidation-ts
```

**Note:** `fluentvalidation-ts` has been written with first-class support for TypeScript, so there's no need to install types!

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

    this.ruleFor('name') // This is type-safe! (Argument is of type 'name' | 'age')
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

[Rules](#rules)

- [`.ruleFor`](#rulefor)
- [`.ruleForEach`](#ruleforeach)

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

## Rules

`fluentvalidation-ts` works by letting you build up rule chains for the properties of your base model. These rule chains are defined in the constructor of your validator.

### `.ruleFor`

In the constructor of your validator, call `this.ruleFor('propertyName')` to access a rule builder for the `propertyName` property of your base model. The rule builder is typed to provide access to relevant validation rules.

For example, if `propertyName` is of type `number` then you will have access to number-specific rules such as `.greaterThan` and `.scalePrecision` - like so:

```typescript
class ExampleValidator extends Validator<ExampleModel> {
  constructor() {
    super();

    this.ruleFor('numberProperty').greaterThan(0);
  }
}
```

Most rules simply depend on the value of the property that they've been defined for. In the example above, the `.greaterThan` rule will look at the value of `numberProperty` and flag it as invalid if it is less than `0`.

However, some validation rules can be defined such that they depend on the base model, as well as the value of the particular property that the rule is being defined for. The `.must` and `.setValidator` rules are two examples.

### `.ruleForEach`

Sometimes your base model will have an array property which you wish to validate the individual items of. For convenience, you can make use of `.ruleForEach` to achieve this.

In the constructor of your validator, call `this.ruleForEach('arrayProperty')` to access a rule builder for each item in the `arrayProperty` property of your base model. As before, this rule builder is typed to provide access to relevant validation rules depending on the type of the items in your array property.

For example, if `arrayProperty` is an array of `string` items, then you will have access to string-specific rules such as `.length` and `.matches` - like so:

```typescript
class ExampleValidator extends Validator<ExampleModel> {
  constructor() {
    super();

    this.ruleForEach('arrayProperty').maxLength(50);
  }
}
```

The validator in this example will validate that each item in the `arrayProperty` property is no more than `50` characters long.

As before, some rules can be defined such that they depend on the base model, as well as the value of the particular item. Note that by "base model" we don't mean the value of the array property, but rather the value of the top-level model which has the `arrayProperty` property on it.

## Validators

`fluentvalidation-ts` comes with a number of built-in validators that cover most common validation you might wish to perform.

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

Note also that in `.ruleForEach` rule chains the type of `TModel` is equal to the type of the **base** model, and not the type of the array property (which would be `Array<TValue>`). For example:

```typescript
this.ruleForEach('pets').must((pet, person) => pet.ownerName === person.name);
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

| Parameter           | Type                                                                                                                                                             | Description                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `validatorProducer` | `(model: TModel) => Validator<TValue>` (where `TModel` is the type of the object being validated, and `TValue` matches the type of the property being validated) | A function which optionally takes the model being validated and returns a validator for validating the specified property. |

**Note:** The parameter here is a function in order to allow the nested validators to depend on the base model, and also to support recursive validation (see [this example](#recursive-types)).

Example usage:

```typescript
this.ruleFor('favouriteBand').setValidator(() => new BandValidator());
```

Note also that in `.ruleForEach` rule chains the type of `TModel` is equal to the type of the **base** model, and not the type of the array property (which would be `Array<TValue>`). For example:

```typescript
// The type of `owner` is equal to the type of the base model, not `Array<Pet>`
this.ruleForEach('pets').setValidator(owner => new PetValidator(owner));
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
| `appliesTo` (optional) | `'AppliesToAllValidators' ǀ 'AppliesToCurrentValidator'`                                | By default the condition applies to all validators in the chain so far (`'AppliesToAllValidators'`), but if you wish to apply the condition to an individual validator you can pass `'AppliesToCurrentValidator'`. |

Example usage:

```typescript
this.ruleFor('numberOfChildren')
  .notNull()
  .when(person => person.hasChildren);
```

Note also that in `.ruleForEach` rule chains the type of `TModel` is equal to the type of the **base** model, and not the type of the array property (which would be `Array<TValue>`). For example:

```typescript
// The type of `owner` is equal to the type of the base model, not `Array<Pet>`
this.ruleForEach('pets')
  .must(pet => pet.species === 'Dog')
  .when(owner => owner.isDogLover);
```

### `.unless`

You can specify a condition to control when a rule should not execute by calling the `.unless` method on a validator definition.

| Parameter              | Type                                                                                    | Description                                                                                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition`            | `(model: TModel) => boolean` (where `TModel` is the type of the object being validated) | A function which takes the model being validated and returns a `boolean` indicating whether the rule should not execute.                                                                                           |
| `appliesTo` (optional) | `'AppliesToAllValidators' ǀ 'AppliesToCurrentValidator'`                                | By default the condition applies to all validators in the chain so far (`'AppliesToAllValidators'`), but if you wish to apply the condition to an individual validator you can pass `'AppliesToCurrentValidator'`. |

Example usage:

```typescript
this.ruleFor('hasPaid')
  .equal(true)
  .unless(customer => customer.getsFreeStuff);
```

Note also that in `.ruleForEach` rule chains the type of `TModel` is equal to the type of the **base** model, and not the type of the array property (which would be `Array<TValue>`). For example:

```typescript
// The type of `owner` is equal to the type of the base model, not `Array<Pet>`
this.ruleForEach('pets')
  .must(pet => pet.species === 'Dog')
  .unless(owner => owner.isScaredOfDogs);
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
// { scores: [null, null, 'Score must be between 0 and 100'] }
```

### With Formik

```tsx
import * as React from 'react';
import { Formik } from 'formik';
import { Validator } from 'fluentvalidation-ts';

export const MyForm = () => (
  <Formik<FormModel>
    validate={formValidator.validate} // <=== This is the important line!
    mapPropsToValues={() => ({ name: '' })}
    handleSubmit={(values, { setSubmitting }) => {
      /* ...submit handler */
    }}
  >
    {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
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
    )}
  </Formik>
);

type FormModel = { name: string };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();
    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');
  }
}

const formValidator = new FormValidator();
```

## Test Coverage

`fluentvalidation-ts` has 100% test coverage via unit tests written with [Jest](https://jestjs.io/).

## Issues

Please report issues via GitHub.

## License

`fluentvalidation-ts` is provided under the terms of an [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

## About the Author

Alex Potter is a full-stack Software Developer who is currently part of the team at [Ghyston](https://www.ghyston.com), an award-winning software development company based in Bristol.

Get in touch [@ajp_dev](https://twitter.com/ajp_dev) on Twitter, or via [LinkedIn](www.linkedin.com/in/alex-james-potter).
