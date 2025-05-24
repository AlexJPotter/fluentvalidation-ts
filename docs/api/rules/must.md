---
id: must
title: '.must'
---

The `.must` rule is used to ensure that a particular property is valid according to a given predicate (or array of predicates).

You can either specify a predicate on its own, or a predicate along with the message to use when the validation fails. You can even pass an array of predicates, which allows you to compose custom validation rules together.

This rule is very useful, as it allows you to define reusable validation logic which can be shared across validators for many different models.

## Examples

### Predicate dependent on value

In this example we specify a predicate on its own, which is dependent only on the value of the property we're validating.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  attendees: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-next-line
    this.ruleFor('attendees').must((attendees) => attendees % 2 === 0);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ attendees: 46 });
// ✔ {}

formValidator.validate({ attendees: 13 });
// ❌ { attendees: 'Value is not valid' }
```

### Predicate dependent on value and model

In this example we specify a predicate on its own, which is dependent on both the value of the property we're validating and the model as a whole.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  yearsInCurrentJob: number;
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-start
    this.ruleFor('yearsInCurrentJob').must(
      (yearsInCurrentJob, formModel) => yearsInCurrentJob < formModel.age
    );
    // highlight-end
  }
}

const formValidator = new FormValidator();

formValidator.validate({ yearsInCurrentJob: 3, age: 30 });
// ✔ {}

formValidator.validate({ yearsInCurrentJob: 99, age: 30 });
// ❌ { yearsInCurrentJob: 'Value is not valid' }
```

### Predicate and message

In this example we define a named variable which wraps up both a predicate and message, so that we can easily reuse the validation logic.

```typescript
import { Validator } from 'fluentvalidation-ts';

// highlight-start
const bePositive = {
  predicate: (value: number) => value > 0,
  message: 'Value must be positive',
};
// highlight-end

type FormModel = {
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-next-line
    this.ruleFor('age').must(bePositive);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ age: 30 });
// ✔ {}

formValidator.validate({ age: -1 });
// ❌ { age: 'Value must be positive' }
```

### Predicate and dynamic message

In this example we again define a named variable which wraps up both a predicate and message, but this time the message is generated dynamically based on the value of the property being validated and the model as a whole.

```typescript
import { Validator } from 'fluentvalidation-ts';

// highlight-start
const matchTheUsername = {
  predicate: (value: string, model: FormModel) => value === model.username,
  message: (value: string, model: FormModel) =>
    `Value (${value}) does not match the username (${model.username})`,
};
// highlight-end

type FormModel = {
  username: string;
  retypeUsername: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-next-line
    this.ruleFor('retypeUsername').must(matchTheUsername);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ username: 'Alex', retypeUsername: 'Alex' });
// ✔ {}

formValidator.validate({ username: 'foo', retypeUsername: 'bar' });
// ❌ { retypeUsername: 'Value (bar) does not match the username (foo)' }
```

### Array of predicates

In this example we define two named variables, which both wrap up a predicate and message. We then define a third named variable, which is an array formed from the previous two.

This usage of the `.must` rule allows us to compose validation rules together - each element is applied in turn and the first failing one produces the error that is returned in the validation errors object.

Note that we composed two rule definitions in this example, but the array can be a mix of both predicates and rule definitions.

```typescript
import { Validator } from 'fluentvalidation-ts';

// highlight-start
const beEven = {
  predicate: (value: number) => value % 2 === 0,
  message: 'Please enter an even number',
};

const bePositive = {
  predicate: (value: number) => value > 0,
  message: 'Please enter a positive number',
};

const beEvenAndPositive = [beEven, bePositive];
// highlight-end

type FormModel = {
  numberOfSocks: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-next-line
    this.ruleFor('numberOfSocks').must(beEvenAndPositive);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ numberOfSocks: 8 });
// ✔ {}

formValidator.validate({ numberOfSocks: -2 });
// ❌ { numberOfSocks: 'Please enter a positive number' }
```

## Reference

The `.must` rule is the most complex of all the built-in rules. You may wish to refer to the examples above to help you understand the different variations of this rule.

### `.must(predicate: SimplePredicate<TModel, TValue>)`

A validation rule which takes in a simple predicate function and ensures that the given property is valid according to that predicate function.

### `.must(predicateAndMessage: SimplePredicateWithMessage<TModel, TValue>)`

A validation rule which takes in a predicate argument that specifies both a simple predicate function and a message (or message generator), and ensures that the given property is valid according to the given predicate function (exposing the relevant message if validation fails).

### `.must(predicates: Array<SimplePredicate<TModel, TValue> | SimplePredicateWithMessage<TModel, TValue>>)`

A validation rule which takes in an array of simple predicate functions and/or predicate function and message (or message generator) pairs, and ensures that the given property is valid according to each one (exposing a relevant message for the first failing predicate if validation fails).

### `SimplePredicateWithMessage<TModel, TValue>`

Equivalent to `{ predicate: SimplePredicate<TModel, TValue>; message: string | MessageGenerator<TModel, TValue> }`

An object that specifies both a simple predicate function and a message (or message generator). The predicate function is used to determine whether a given value is valid, and the message (either explicit or generated) is used in the validation errors object if validation fails.

### `SimplePredicate<TModel, TValue>`

Equivalent to `(value: TValue, model: TModel) => boolean`.

A simple predicate is a function which accepts the value of the property being validated and the value of the model as a whole, and returns a `boolean` indicating whether the property is valid or not.

A return value of `true` indicates that the property is valid ✔.

Conversely, a return value of `false` indicates that the property is invalid ❌.

### `MessageGenerator<TModel, TValue>`

Equivalent to `(value: TValue, model: TModel) => string`.

A function which accepts both the value being validated and the model as a whole, and returns an appropriate error message.

### `TValue`

Matches the type of the property that the rule is applied to.

### `TModel`

Matches the type of the base model.

## Example Message

> Value is not valid
