---
id: version-2.1.2-equal
title: .equal
original_id: equal
---

The `.equal` rule is used to ensure that the value of a given property is equal to a given value.

Note that this rule uses **strict** equality (i.e. the `===` operator) and may not work as intended for object or array values.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  acceptsTermsAndConditions: boolean;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('acceptsTermsAndConditions').equal(true);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ acceptsTermsAndConditions: true });
// ✔ {}

formValidator.validate({ acceptsTermsAndConditions: false });
// ❌ { acceptsTermsAndConditions: `Must equal 'true'` }
```

## Reference

### `.equal(comparisonValue: TValue)`

A base validation rule which takes in a value and ensures that the given property is equal to that value.

### `TValue`

Matches the type of the property that the rule is applied to.

## Example Message

> Must equal '`[comparisonValue]`'
