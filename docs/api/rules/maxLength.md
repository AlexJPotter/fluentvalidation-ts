---
id: maxLength
title: .maxLength
---

The `.maxLength` rule is used to ensure that the length of a given `string` property is less than or equal to a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  username: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('username').maxLength(20);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ username: 'AlexPotter' });
// ✔ {}

formValidator.validate({ username: 'ThisUsernameIsFarTooLong' });
// ❌ { username: 'Value must be no more than 20 characters long' }
```

## Reference

### `.maxLength(upperBound: number)`

A string validation rule which takes in an upper bound and ensures that the length of the given property is less than or equal to it.

## Example Message

> Value must be no more than `[upperBound]` characters long
