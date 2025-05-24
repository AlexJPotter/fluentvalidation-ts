---
id: ambientContext
title: Ambient Context
---

Sometimes your validation logic will need to depend on external, or "ambient", context that isn't part of your form model. With **fluentvalidation-ts** validators are just classes, so you can make use of constructor arguments to inject dependencies.

## The Gist

You can inject external dependencies into your validators using constructor arguments:

```typescript
type FormModel = {
  age: number;
};

class FormValidator extends Validator<FormModel> {
  // highlight-next-line
  constructor(country: string) {
    super();

    this.ruleFor('age')
      // highlight-next-line
      .greaterThanOrEqualTo(country === 'US' ? 21 : 18);
  }
}
```

This approach means that you need to instantiate a new instance of your validator every time the ambient context changes, so there is potentially a performance cost involved.

Usage of the example validator from above might look something like this:

```typescript
const ukValidator = new FormValidator('UK');
const usValidator = new FormValidator('US');

const pubGoer = { age: 20 };

const ukResult = ukValidator.validate(pubGoer); // {}
const usResult = usValidator.validate(pubGoer); // { age: 'Value must be greater than or equal to 21' }
```
