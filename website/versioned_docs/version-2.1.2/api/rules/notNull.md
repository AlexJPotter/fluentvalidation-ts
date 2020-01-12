---
id: version-2.1.2-notNull
title: .notNull
original_id: notNull
---

The `.notNull` rule is used to ensure that the value of a given property is not `null` (or `undefined`).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  customerId: number | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('customerId').notNull();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ customerId: 100 });
// ✔ {}

formValidator.validate({ customerId: null });
// ❌ { customerId: 'Value cannot be null' }
```

## Reference

### `.notNull()`

A validation rule which ensures that the given property is not `null` (or `undefined`).

## Example Message

> Value cannot be null
