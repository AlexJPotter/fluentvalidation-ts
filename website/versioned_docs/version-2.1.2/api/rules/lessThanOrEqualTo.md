---
id: version-2.1.2-lessThanOrEqualTo
title: .lessThanOrEqualTo
original_id: lessThanOrEqualTo
---

The `.lessThanOrEqualTo` rule is used to ensure that the value of a given `number` property is less than or equal to a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  passengers: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('passengers').lessThanOrEqualTo(4);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ passengers: 4 });
// ✔ {}

formValidator.validate({ passengers: 6 });
// ❌ { passengers: 'Value must be less than or equal to 4' }
```

## Reference

### `.lessThanOrEqualTo(threshold: number)`

A number validation rule which takes in a threshold and ensures that the given property is less than or equal to it.

## Example Message

> Value must be less than or equal to `[threshold]`
