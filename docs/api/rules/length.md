---
id: length
title: .length
---

The `.length` rule is used to ensure that the length of a given `string` property is inclusively between the given bounds (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  voucherCode: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('voucherCode').length(5, 10);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ voucherCode: 'ABC44' });
// ✔ {}

formValidator.validate({ voucherCode: 'ZZ' });
// ❌ { voucherCode: 'Value must be between 5 and 10 characters long' }
```

## Reference

### `.length(lowerBound: number, upperBound: number)`

A string validation rule which takes in a lower bound and upper bound and ensures that the length of the given property is inclusively between them (i.e. greater than or equal to the lower bound and less than or equal to the upper bound).

## Example Message

> Value must be between `[lowerBound]` and `[upperBound]` characters long
