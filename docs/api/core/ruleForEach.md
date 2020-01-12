---
id: ruleForEach
title: .ruleForEach
---

The `.ruleForEach` method on the `Validator` class is much like the [`.ruleFor`](api/core/ruleFor.md) method, except that is used to build up rule chains for **array** properties on your model.

You can use `.ruleForEach` to specify a rule chain that should apply to **each element** of a particular array property. Aside from this, the `.ruleForEach` method works almost exactly the same as the [`.ruleFor`](api/core/ruleFor.md) method, with all the chaining and configuration available in exactly the same way.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = { scores: Array<number> };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleForEach('scores')
      .greaterThan(0)
      .withMessage('Please enter a positive score')
      .lessThanOrEqualTo(5)
      .withMessage('Please enter a score no greater than 5');
  }
}
```
