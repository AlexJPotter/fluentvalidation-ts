---
id: version-2.2.0-asyncValidator
title: AsyncValidator
original_id: asyncValidator
---

The `AsyncValidator<TModel>` generic class is an extension of [`Validator<TModel>`](api/core/validator.md) that has additional async rules available (most notably [`.mustAsync`](api/rules/mustAsync.md) and [`.setAsyncValidator`](api/rules/setAsyncValidator.md)).

```typescript
import { AsyncValidator } from 'fluentvalidation-ts';
```

Defining an async validator for a model of type `TModel` works exactly the same as defining a standard validator - all you have to do is define a class which extends `AsyncValidator<TModel>` (as opposed to `Validator<TModel>`) and specify some rules in the constructor using the [`.ruleFor`](api/core/ruleFor.md) and [`.ruleForEach`](api/core/ruleForEach.md) methods.

```typescript
type FormModel = { username: string };

class FormValidator extends AsyncValidator<FormModel> {
  constructor() {
    super();

    this.ruleFor('username').mustAsync(async (username) =>
       await api.usernameIsAvailable(username);
    )
    .withMessage('This username is already taken');
  }
}
```

To actually validate an instance of your model, simply create an instance of your validator and pass your model to the `.validateAsync` method. As the name suggests this method is **asynchronous**, so be sure to `await` the result or use Promise callback methods (i.e. `.then` and `.catch`).

Note that the synchronous `.validate` method is **not available** on an instance of `AsyncValidator`, you must always use the `.validateAsync` method.

```typescript
const formValidator = new FormValidator();

const validResult = await formValidator.validateAsync({
  username: 'ajp_dev123',
});
// ✔ {}

const invalidResult = await formValidator.validateAsync({
  username: 'ajp_dev',
});
// ❌ { username: 'This username is already taken' }
```

A call to `.validateAsync` returns a `Promise` that resolves to an object of type [`ValidationErrors<TModel>`](api/core/validationErrors.md), which describes the validity of the given value.
