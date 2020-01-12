---
id: version-2.1.2-lessThan
title: .lessThan
original_id: lessThan
---

The `.lessThan` rule is used to ensure that the value of a given `number` property is strictly less than a given value.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  bagWeightInKilograms: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('bagWeightInKilograms').lessThan(20);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ bagWeightInKilograms: 18.5 });
// ✔ {}

formValidator.validate({ bagWeightInKilograms: 22.8 });
// ❌ { bagWeightInKilograms: 'Value must be less than 20' }
```

## Reference

### `.lessThan(threshold: number)`

A number validation rule which takes in a threshold and ensures that the given property is strictly less than it.

## Example Message

> Value must be less than `[threshold]`
