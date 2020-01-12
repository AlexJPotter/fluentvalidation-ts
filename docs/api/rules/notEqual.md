---
id: notEqual
title: .notEqual
---

The `.notEqual` rule is used to ensure that the value of a given property is not equal to a given value.

Note that this rule uses **strict** inequality (i.e. the `!==` operator) and may not work as intended for object or array values.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  acceptsTermsAndConditions: boolean;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('acceptsTermsAndConditions').notEqual(false);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ acceptsTermsAndConditions: true });
// ✔ {}

formValidator.validate({ acceptsTermsAndConditions: false });
// ❌ { acceptsTermsAndConditions: `Value must not equal 'false'` }
```

## Reference

### `.notEqual(comparisonValue: TValue)`

A base validation rule which takes in a value and ensures that the given property is not equal to that value.

### `TValue`

Matches the type of the property that the rule is applied to.

## Example Message

> Value must not equal '`[comparisonValue]`'
