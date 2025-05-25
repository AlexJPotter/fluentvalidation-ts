---
id: precisionScale
title: '.precisionScale'
---

The `.precisionScale` rule is used to ensure that the value of a given `number` property is permissible for the specified **precision** and **scale**.

These terms are defined as follows:

- **Precision** is the number of digits in a number.
- **Scale** is the number of digits to the right of the decimal point in a number.

:::warning

Prior to `v5.0.0` the `.precisionScale` rule was called `.scalePrecision` and the parameter naming was incorrect!

:::

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  price: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('price').precisionScale(4, 2);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ price: 10.01 });
// ✔ {}

formValidator.validate({ price: 0.001 }); // Too many digits after the decimal point
// ❌ { price: 'Value must be no more than 4 digits in total, with allowance for 2 decimals' }

formValidator.validate({ price: 100.1 }); // Too many digits (when accounting for reserved digits after the decimal point)
// ❌ { price: 'Value must be no more than 4 digits in total, with allowance for 2 decimals' }
```

## Reference

### `.precisionScale(precision: number, scale: number)`

A number validation rule which takes in an allowed precision and scale, and ensures that the value of the given property is permissible.

:::danger

Due to rounding issues with floating point numbers in JavaScript, this rule may not function as expected for large precisions/scales.

:::

### `precision`

This is the total number of digits that the value may have (taking into account the number of digits "reserved" for after the decimal point).

The maximum number of significant digits allowed before the decimal point (i.e. the integer part) can be calculated as `(precision - scale)`.

### `scale`

This is the maximum number of digits after the decimal point that the value may have.

:::note

When `precision` and `scale` are equal, the "leading zero" to the left of the decimal point is **not** counted as a digit (e.g. a value of `0.01` would be viewed as `.01`).

:::

## Example Message

> Value must not be more than `[precision]` digits in total, with allowance for `[scale]` decimals
