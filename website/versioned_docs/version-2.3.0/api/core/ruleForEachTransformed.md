---
id: version-2.3.0-ruleForEachTransformed
title: .ruleForEachTransformed
original_id: ruleForEachTransformed
---

The `.ruleForEachTransformed` method on the `Validator` class is identical to the [`.ruleForEach`](api/core/ruleForEach.md) method, except that it allows you to transform each item of the given array property on your model via a transformation function prior to building up the rule chain for it.

The available validation rules will be based on the type of the **transformed** items, rather than the original type of the items.

To get started, simply call `this.ruleForTransformed` in the constructor of your validator and pass in the name of an array property on your model, along with a transformation function.

The result of this call is a rule chain builder, exactly the same as that returned by [`.ruleForEach`](api/core/ruleForEach.md), except that it exposes all the relevant built-in validation rules for the type of the **transformed** item values.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  scores: Array<string>;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleForEachTransformed('scores', (s) => Number(s))
      .must((numberScore) => !isNaN(numberScore))
      .greaterThan(0)
      .lessThanOrEqualTo(100);
  }
}
```

## Limitations

The same limitations that apply to the [`.ruleForTransformed`](api/core/ruleForTransformed.md) method apply also to the `.ruleForEachTransformed` method.
