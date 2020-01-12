---
id: version-2.1.2-withMessage
title: .withMessage
original_id: withMessage
---

The `.withMessage` option is used to specify a custom error message that should be used when a given validation rule fails.

All validation rules have a default error message associated with them, but sometimes you may wish to override these defaults and specify your own user-friendly error message.

Note that `.withMessage` only applies to the rule immediately preceding it in the rule chain, not to all rules in the chain so far.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  name: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name')
      .maxLength(1000)
      .withMessage('Please enter no more than 1,000 characters');
  }
}

const formValidator = new FormValidator();

formValidator.validate({ name: 'Alex' });
// ✔ {}

formValidator.validate({ name: '' });
// ❌ { name: 'Please enter your name' }
```

## Reference

### `.withMessage(customMessage: string)`

A configuration option which takes a custom error message and uses that message in place of the default error message if the given validation rule fails.
