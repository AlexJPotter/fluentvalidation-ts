---
id: ruleFor
title: .ruleFor
---

The `.ruleFor` method on the `Validator` class is used to build up rule chains for properties on your model.

To get started, simply call `this.ruleFor` in the constructor of your validator and pass in the name of a property on your model (note that this is strongly typed, you'll get a compilation error if you pass the name of a property that doesn't exist on the model).

The result of this call is a rule chain builder that exposes all the relevant built-in validation rules for the property you specified.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  name: string;
  isEmployed: boolean;
  jobTitle: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // Returns a rule chain builder for the 'name' property
    this.ruleFor('name');
  }
}
```

To add a validation rule to the target property, simply call the relevant method on the rule chain builder (passing in any parameters as necessary). The result of such a call is again the rule chain builder, so you can specify multiple rules in a single call to `.ruleFor`.

```typescript
// The result of adding a rule is again the rule chain builder,
// so you can add multiple rules in a single call
this.ruleFor('name')
  .notEmpty()
  .maxLength(100);
```

After adding a rule to the chain you also gain access to a number of configuration methods which allow you to do things like specify what error should be used if the validation rule fails, and conditions under which the rules should/shouldn't run.

```typescript
this.ruleFor('name')
  .notEmpty()
  .maxLength(100);

// You can specify a custom error message for each rule in the chain,
// and provide a condition to determine when the rules should run
this.ruleFor('jobTitle')
  .notEmpty()
  .withMessage('Please enter a Job Title')
  .maxLength(100)
  .withMessage('Please enter no more than 100 characters')
  .when(formModel => formModel.isEmployed);

// You can also provide a condition to determine when certain rules
// should not run
this.ruleFor('jobTitle')
  .equal('')
  .withMessage('You cannot enter a Job Title if you are not employed')
  .unless(formModel => formModel.isEmployed);
```

As the above example illustrates, you can make several calls to `.ruleFor` for the same property. It doesn't matter how many rule chains you define for a particular property, and you don't have to define any at all if you don't need to.
