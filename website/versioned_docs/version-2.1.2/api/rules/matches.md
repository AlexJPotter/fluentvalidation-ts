---
id: version-2.1.2-matches
title: .matches
original_id: matches
---

The `.matches` rule is used to ensure that the value of a given `string` property matches the given [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  price: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('price').matches(new RegExp('^([0-9])+.([0-9]){2}$'));
  }
}

const formValidator = new FormValidator();

formValidator.validate({ price: '249.99' });
// ✔ {}

formValidator.validate({ price: '15' });
// ❌ { price: 'Value does not match the required pattern' }
```

## Reference

### `.matches(pattern: RegExp)`

A string validation rule which takes in a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) and ensures that the given property matches it.

## Example Message

> Value does not match the required pattern
