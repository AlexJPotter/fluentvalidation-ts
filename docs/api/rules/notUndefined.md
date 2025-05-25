---
id: notUndefined
title: '.notUndefined'
---

The `.notUndefined` rule is used to ensure that the value of a given property is not `undefined`.

:::note

Note that this rule considers `null` values to be **valid**. If you need to disallow both `null` and `undefined` values (or just `null` values), you may use the [`.notNull`](./notNull.md) rule instead.

:::

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  customerId?: number | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('customerId').notUndefined();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ customerId: 100 });
// ✔ {}

formValidator.validate({ customerId: null });
// ✔ {}

formValidator.validate({});
// ❌ { customerId: 'Value cannot be undefined' }

formValidator.validate({ customerId: undefined });
// ❌ { customerId: 'Value cannot be undefined' }
```

## Reference

### `.notUndefined()`

A validation rule which ensures that the given property is not `undefined`.

## Example Message

> Value cannot be undefined
