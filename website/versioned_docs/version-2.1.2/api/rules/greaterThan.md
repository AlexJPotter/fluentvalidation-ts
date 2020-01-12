---
id: version-2.1.2-greaterThan
title: .greaterThan
original_id: greaterThan
---

The `.greaterThan` rule is used to ensure that the value of a given `number` property is strictly greater than a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  quantity: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('quantity').greaterThan(0);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ quantity: 2 });
// ✔ {}

formValidator.validate({ quantity: 0 });
// ❌ { quantity: 'Value must be greater than 0' }
```

## Reference

### `.greaterThan(threshold: number)`

A number validation rule which takes in a threshold and ensures that the given property is strictly greater than it.

## Example Message

> Value must be greater than `[threshold]`
