---
id: exclusiveBetween
title: .exclusiveBetween
---

The `.exclusiveBetween` rule is used to ensure that the value of a given `number` property is exclusively between the given bounds (i.e. greater than the lower bound and less than the upper bound).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  score: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('score').exclusiveBetween(0, 10);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ score: 5 });
// ✔ {}

formValidator.validate({ score: 0 });
// ❌ { score: 'Value must be between 0 and 10 (exclusive)' }
```

## Reference

### `.exclusiveBetween(lowerBound: number, upperBound: number)`

A number validation rule which takes in a lower bound and upper bound and ensures that the given property is exclusively between them (i.e. greater than the lower bound and less than the upper bound).

## Example Message

> Value must be between `[lowerBound]` and `[upperBound]` (exclusive)
