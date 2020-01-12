---
id: version-2.1.2-emailAddress
title: .emailAddress
original_id: emailAddress
---

The `.emailAddress` rule is used to ensure that the value of a given `string` property is a valid email address.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  contactEmail: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('contactEmail').emailAddress();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ contactEmail: 'foo@example.com' });
// ✔ {}

formValidator.validate({ contactEmail: 'foo' });
// ❌ { contactEmail: 'Not a valid email address' }
```

## Reference

### `.emailAddress()`

A string validation rule which ensures that the given property is a valid email address.

## Example Message

> Not a valid email address
