---
id: ruleForTransformed
title: '.ruleForTransformed'
---

The `.ruleForTransformed` method on the `Validator` class is identical to the [`.ruleFor`](api/core/ruleFor.md) method, except that it allows you to transform the given property on your model via a transformation function prior to building up the rule chain for it.

The available validation rules will be based on the type of the **transformed** value, rather than the original type of the property.

To get started, simply call `this.ruleForTransformed` in the constructor of your validator and pass in the name of a property on your model, along with a transformation function.

The result of this call is a rule chain builder, exactly the same as that returned by [`.ruleFor`](api/core/ruleFor.md), except that it exposes all the relevant built-in validation rules for the type of the **transformed** property value.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  quantity: string;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleForTransformed('quantity', (q) => Number(q))
      .must((numberQuantity) => !isNaN(numberQuantity))
      .greaterThan(0)
      .lessThanOrEqualTo(100);
  }
}
```

## Limitations

Note that in order to preserve the shape of the [errors object](api/core/validationErrors.md) returned by the `.validate` and `.validateAsync` methods, the transformation function passed to `.ruleForTransformed` cannot map flat types into complex types.

For example, a `string` property cannot be transformed into an `Array<string>`. This is because the errors object could then contain an array of errors at the path of the `string` property, while the expected type at this path is a "flat" error (i.e. `string | null | undefined`).

For the same reasons, complex types cannot be mapped to other complex types that look different. For example, if an `object` property is mapped to another `object` with different properties, then the errors object could contain nested errors at the path of the property with unexpected keys (i.e. keys not present on the original type of the property).

It is possible to map complex types to flat types, or complex types to other complex types with some/all of the same properties. This is because the shape of the errors object is preserved in these cases.
