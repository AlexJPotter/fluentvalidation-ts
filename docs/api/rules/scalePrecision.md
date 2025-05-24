---
id: scalePrecision
title: '.scalePrecision'
---

The `.scalePrecision` rule is used to ensure that the value of a given `number` property has the given scale and precision.

> Due to rounding issues with floating point numbers in JavaScript this rule may not function as expected for large scales/precisions.

## Example

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  price: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('price').scalePrecision(2, 4);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ price: 10.01 });
// ✔ {}

formValidator.validate({ price: 0.001 });
// ❌ { price: 'Value must be no more than 4 digits in total, with allowance for 2 decimals' }
```

## Reference

### `.scalePrecision(precision: number, scale: number)`

A number validation rule which takes in an allowed scale and precision and ensures that the value of the given property is suitable.

> Due to rounding issues with floating point numbers in JavaScript this rule may not function as expected for large scales/precisions.

### `precision`

This is the maximum number of digits after the decimal place that the value may have.

In the above example, the following values would be valid:

```
0, 0.1, 0.01 ✔
```

Conversely, the following would be invalid:

```
0.001, 0.0001 ❌
```

### `scale`

This is the total number of digits that the value may have (taking into account the number of digits allowed after the decimal place).

The maximum number of digits allowed before the decimal point can be calculated as `(scale - precision)`.

In the above example, the following values would be valid:

```
10, 10.1, 10.01 ✔
```

Conversely, the following values would be invalid:

```
100, 1000 ❌
```

## Example Message

> Value must be no more than `[scale]` digits in total, with allowance for `[precision]` decimals
