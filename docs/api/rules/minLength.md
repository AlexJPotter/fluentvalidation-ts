---
id: minLength
title: '.minLength'
---

The `.minLength` rule is used to ensure that the length of a given `string` property is greater than or equal to a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  password: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('password').minLength(6);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ password: 'supersecret' });
// ✔ {}

formValidator.validate({ password: 'foo' });
// ❌ { password: 'Value must be at least 6 characters long' }
```

## Reference

### `.minLength(lowerBound: number)`

A string validation rule which takes in a lower bound and ensures that the length of the given property is greater than or equal to it.

## Example Message

> Value must be at least `[lowerBound]` characters long
