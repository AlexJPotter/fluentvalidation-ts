---
id: validator
title: Validator
---

The `Validator<TModel>` generic class is the core component of the `fluentvalidation-ts` API.

```typescript
import { Validator } from 'fluentvalidation-ts';
```

To define a validator for a model of type `TModel` all you have to do is define a class which extends `Validator<TModel>` and specify some rules in the constructor using the `.ruleFor` and `.ruleForEach` methods.

```typescript
type FormModel = { name: string };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');
  }
}
```

To actually validate an instance of your model, simply create an instance of your validator and pass your model to the `.validate` method.

```typescript
const formValidator = new FormValidator();

const validResult = formValidator.validate({ name: 'Alex' });
// ✔ {}

const invalidResult = formValidator.validate({ name: '' });
// ❌ { name: 'Please enter your name' }
```

A call to `.validate` returns an object of type `ValidationErrors<TModel>`, which describes the validity of the given value.
