---
id: null-rule
title: .null
---

The `.null` rule is used to ensure that the value of a given property is `null` (or `undefined`).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  apiError: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('apiError').null();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ apiError: null });
// ✔ {}

formValidator.validate({ apiError: 'Failed to fetch data from the API' });
// ❌ { apiError: 'Value must be null' }
```

## Reference

### `.null()`

A validation rule which ensures that the given property is `null` (or `undefined`).

## Example Message

> Value must be null
