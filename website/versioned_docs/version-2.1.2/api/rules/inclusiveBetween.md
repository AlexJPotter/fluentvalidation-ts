---
id: version-2.1.2-inclusiveBetween
title: .inclusiveBetween
original_id: inclusiveBetween
---

The `.inclusiveBetween` rule is used to ensure that the value of a given `number` property is inclusively between the given bounds (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  percentageComplete: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('percentageComplete').inclusiveBetween(0, 100);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ percentageComplete: 50 });
// ✔ {}

formValidator.validate({ percentageComplete: 110 });
// ❌ { percentageComplete: 'Value must be between 0 and 100 (inclusive)' }
```

## Reference

### `.inclusiveBetween(lowerBound: number, upperBound: number)`

A number validation rule which takes in a lower bound and upper bound and ensures that the given property is inclusively between them (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

## Example Message

> Value must be between `[lowerBound]` and `[upperBound]` (inclusive)
