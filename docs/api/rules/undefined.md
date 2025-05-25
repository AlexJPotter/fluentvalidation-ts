---
id: undefinedRule
title: '.undefined'
---

The `.undefined` rule is used to ensure that the value of a given property is `undefined`.

:::note

Note that this rule considers `null` values to be **invalid**. If you need to allow for both `null` and `undefined` values (or just `null` values), you may use the [`.null`](./null.md) rule instead.

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

    this.ruleFor('customerId').undefined();
  }
}

const formValidator = new FormValidator();

formValidator.validate({});
// ✔ {}

formValidator.validate({ customerId: undefined });
// ✔ {}

formValidator.validate({ customerId: 100 });
// ❌ { customerId: 'Value must be undefined' }

formValidator.validate({ customerId: null });
// ❌ { customerId: 'Value must be undefined' }
```

## Reference

### `.undefined()`

A validation rule which ensures that the given property is `undefined`.

## Example Message

> Value must be undefined
