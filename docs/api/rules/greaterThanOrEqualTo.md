---
id: greaterThanOrEqualTo
title: '.greaterThanOrEqualTo'
---

The `.greaterThanOrEqualTo` rule is used to ensure that the value of a given `number` property is greater than or equal to a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('age').greaterThanOrEqualTo(18);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ age: 18 });
// ✔ {}

formValidator.validate({ age: 16 });
// ❌ { age: 'Value must be greater than or equal to 18' }
```

## Reference

### `.greaterThanOrEqualTo(threshold: number)`

A number validation rule which takes in a threshold and ensures that the given property is greater than or equal to it.

## Example Message

> Value must be greater than or equal to `[threshold]`
