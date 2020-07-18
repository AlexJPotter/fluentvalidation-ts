---
id: version-2.2.0-mustAsync
title: .mustAsync
original_id: mustAsync
---

The `.mustAsync` rule is one of the special async rules that become available when you extend from [`AsyncValidator`](api/core/asyncValidator.md) as opposed to just [`Validator`](api/core/validator.md).

This rule works exactly the same as the [`.must`](api/rules/must.md) rule, except that it takes an async predicate function. This allows you to do things like define custom validation rules which perform API requests (e.g. checking if a username is already taken).

All the various overloads for the [`.must`](api/rules/must.md) rule are also available for the `.mustAsync` rule - the only difference is that your predicate function must be async (i.e. have a return type of `Promise<boolean>` instead of `boolean`).

## Examples

The documentation page for the [`.must`](api/rules/must.md) rule includes a full list of examples demonstrating the different overloads that are available.

These are all relevant to the `.mustAsync` rule too, just replace `Validator` with `AsyncValidator`, `.must` with `.mustAsync`, and synchronous predicate functions with asynchronous ones.

### Predicate dependant on value

In this example we specify an async predicate on its own, which is dependant only on the value of the property we're validating.

```typescript
import { AsyncValidator } from 'fluentvalidation-ts';

type FormModel = {
  username: string;
};

class FormValidator extends AsyncValidator<FormModel> {
  constructor() {
    super();

    this.ruleFor('username').mustAsync(
      async (username) => await api.usernameIsAvailable(username)
    );
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

### `.mustAsync(predicate: AsyncPredicate<TValue, TModel>)`

A validation rule which takes in an async predicate and ensures that the given property is valid according to that predicate.

### `.mustAsync(definition: AsyncRuleDefinition<TValue, TModel>)`

A validation rule which takes in a definition that specifies both an async predicate and a message (or message generator), and ensures that the given property is valid according to the given predicate (exposing the relevant message if validation fails).

### `.mustAsync(asyncPredicatesAndDefinitions: Array<AsyncPredicate<TValue, TModel> | AsyncRuleDefinition<TValue, TModel>>)`

A validation rule which takes in an array of async predicates and/or async rule definitions, and ensures that the given property is valid according to each one (exposing a relevant message for the first failing predicate if validation fails).

### `AsyncRuleDefinition<TValue, TModel>`

Equivalent to `{ predicate: AsyncPredicate<TValue, TModel>; message: string | MessageGenerator<TValue, TModel> }`

An object that specifies both an async predicate and a message generator. The predicate is used to determine whether a given value is valid, and the message (either explicit or generated) is used in the validation errors object if validation fails.

### `AsyncPredicate<TValue, TModel>`

Equivalent to `(value: TValue, model: TModel) => Promise<boolean>`.

A predicate is an async function which accepts the value of the property being validated and the value of the model as a whole, and returns a `Promise<boolean>` indicating whether the property is valid or not.

A return value that resolves to `true` indicates that the property is valid ✔.

Conversely, a return value that resolves to `false` indicates that the property is invalid ❌.

### `MessageGenerator<TValue, TModel>`

Equivalent to `(value: TValue, model: TModel) => string`.

A function which accepts both the value being validated and the model as a whole, and returns an appropriate error message.

### `TValue`

Matches the type of the property that the rule is applied to.

### `TModel`

Matches the type of the base model.

## Example Message

> Value is not valid
