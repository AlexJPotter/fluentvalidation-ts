---
id: notEmpty
title: '.notEmpty'
---

The `.notEmpty` rule is used to ensure that the value of a given `string` property is not the empty string, or formed entirely of whitespace.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  name: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ name: 'Alex' });
// ✔ {}

formValidator.validate({ name: '   ' });
// ❌ { name: 'Value cannot be empty' }
```

## Reference

### `.notEmpty()`

A string validation rule which ensures that the given property is not the empty string, or formed entirely of whitespace.

## Example Message

> Value cannot be empty
