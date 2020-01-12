---
id: ambientContext
title: Ambient Context
---

Sometimes your validation logic will need to depend on external, or "ambient", context that isn't part of your form model. With fluentvalidation-ts validators are just classes, so you can make use of constructor arguments to inject dependencies.

## The Gist

You can inject external dependencies into your validators using constructor arguments:

```typescript
type FormModel = {
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor(country: string) {
    super();

    this.ruleFor('age')
      .greaterThanOrEqualTo(country === 'US' ? 21 : 18);
  }
}
```

This approach means that you need to instantiate a new instance of your validator every time the ambient context changes, so there is potentially a performance cost involved.
