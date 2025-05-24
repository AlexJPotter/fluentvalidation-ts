---
id: mustAsync
title: '.mustAsync'
---

The `.mustAsync` rule is one of the special async rules that become available when you extend from [`AsyncValidator`](api/core/asyncValidator.md) as opposed to just [`Validator`](api/core/validator.md).

This rule works exactly the same as the [`.must`](api/rules/must.md) rule, except that it takes an async predicate function. This allows you to do things like define custom validation rules which perform API requests (e.g. checking if a username is already taken).

All the various overloads for the [`.must`](api/rules/must.md) rule are also available for the `.mustAsync` rule - the only difference is that your predicate function must be async (i.e. have a return type of `Promise<boolean>` instead of `boolean`).

## Examples

The documentation page for the [`.must`](api/rules/must.md) rule includes a full list of examples demonstrating the different overloads that are available.

These are all relevant to the `.mustAsync` rule too, just replace `Validator` with `AsyncValidator`, `.must` with `.mustAsync`, and synchronous predicate functions with asynchronous ones.

### Predicate dependent on value

In this example we specify an async predicate on its own, which is dependent only on the value of the property we're validating.

```typescript
import { AsyncValidator } from 'fluentvalidation-ts';

type FormModel = {
  username: string;
};

class FormValidator extends AsyncValidator<FormModel> {
  constructor() {
    super();

    // highlight-start
    this.ruleFor('username').mustAsync(
      async (username) => await api.usernameIsAvailable(username)
    );
    // highlight-end
  }
}

const formValidator = new FormValidator();

await formValidator.validateAsync({ username: 'ajp_dev123' });
// ✔ {}

await formValidator.validateAsync({ username: 'ajp_dev' });
// ❌ { username: 'Value is not valid' }
```

## Reference

The `.mustAsync` rule is one of the more complex built-in rules. You may wish to refer to the examples on the documentation page for the [`.must`](api/rules/must.md) rule to help you understand the different variations of this rule.

### `.mustAsync(predicate: SimpleAsyncPredicate<TModel, TValue>)`

A validation rule which takes in a simple async predicate function and ensures that the given property is valid according to that predicate function.

### `.mustAsync(predicateAndMessage: SimpleAsyncPredicateWithMessage<TModel, TValue>)`

A validation rule which takes in a definition that specifies both an async predicate function and a message (or message generator), and ensures that the given property is valid according to the given predicate function (exposing the relevant message if validation fails).

### `.mustAsync(definitions: Array<SimpleAsyncPredicate<TModel, TValue> | SimpleAsyncPredicateWithMessage<TModel, TValue>>)`

A validation rule which takes in an array of async predicate functions and/or predicate function and message (or message generator) pairs, and ensures that the given property is valid according to each one (exposing a relevant message for the first failing predicate if validation fails).

### `SimpleAsyncPredicateWithMessage<TModel, TValue>`

Equivalent to `{ predicate: SimpleAsyncPredicate<TModel, TValue>; message: string | MessageGenerator<TModel, TValue> }`

An object that specifies both an async predicate function and a message (or message generator). The predicate function is used to determine whether a given value is valid, and the message (either explicit or generated) is used in the validation errors object if validation fails.

### `SimpleAsyncPredicate<TModel, TValue>`

Equivalent to `(value: TValue, model: TModel) => Promise<boolean>`.

A simple predicate is an async function which accepts the value of the property being validated and the value of the model as a whole, and returns a `Promise<boolean>` indicating whether the property is valid or not.

A return value that resolves to `true` indicates that the property is valid ✔.

Conversely, a return value that resolves to `false` indicates that the property is invalid ❌.

### `MessageGenerator<TModel, TValue>`

Equivalent to `(value: TValue, model: TModel) => string`.

A function which accepts both the value being validated and the model as a whole, and returns an appropriate error message.

### `TValue`

Matches the type of the property that the rule is applied to.

### `TModel`

Matches the type of the base model.

## Example Message

> Value is not valid
