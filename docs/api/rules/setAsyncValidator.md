---
id: setAsyncValidator
title: '.setAsyncValidator'
---

The `.setAsyncValidator` rule is one of the special async rules that become available when you extend from [`AsyncValidator`](api/core/asyncValidator.md) as opposed to just [`Validator`](api/core/validator.md).

This rule works exactly the same as the [`.setValidator`](api/rules/setValidator.md) rule, except that you must pass an instance of [`AsyncValidator`](api/core/asyncValidator.md) as opposed to an instance of [`Validator`](api/core/validator.md).

As with the [`.setValidator`](api/rules/setValidator.md) rule, the async validator to use is specified by way of a producer function, which takes in the value of the base model and returns an appropriate validator.

## Examples

The documentation page for the [`.setValidator`](api/rules/setValidator.md) rule includes a full list of examples demonstrating the different overloads that are available.

These are all relevant to the `.setAsyncValidator` rule too, just replace `Validator` with `AsyncValidator` and `.setValidator` with `.setAsyncValidator`.

### Nested validator does not depend on the base model

In this example the nested validator has no dependency on the base model, so we can simply define an instance of the nested validator ahead of time and return that from the validator producer function.

```typescript
import { AsyncValidator } from 'fluentvalidation-ts';

type ContactDetails = {
  name: string;
  emailAddress: string;
};

// highlight-start
class ContactDetailsValidator extends AsyncValidator<ContactDetails> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty();

    this.ruleFor('emailAddress')
      .emailAddress()
      .mustAsync(
        async (emailAddress) => await api.emailAddressNotInUse(emailAddress)
      )
      .withMessage('This email address is already in use');
  }
}

const contactDetailsValidator = new ContactDetailsValidator();
// highlight-end

type FormModel = {
  contactDetails: ContactDetails;
};

class FormValidator extends AsyncValidator<FormModel> {
  constructor() {
    super();

    // highlight-start
    this.ruleFor('contactDetails').setAsyncValidator(
      () => contactDetailsValidator
    );
    // highlight-end
  }
}

const formValidator = new FormValidator();

await formValidator.validateAsync({
  contactDetails: { name: 'Alex', emailAddress: 'alex123@example.com' },
});
// ✔ {}

await formValidator.validateAsync({
  contactDetails: { name: 'Alex', emailAddress: 'alex@example.com' },
});
// ❌ { contactDetails: { emailAddress: 'This email address is already in use' } }
```

## Reference

### `.setAsyncValidator(asyncValidatorProducer: (model: TModel) => AsyncValidator<TValue>)`

A validation rule which takes in a validator producer function and ensures that the given property is valid according to the async validator produced by that function.

### `TModel`

Matches the type of the base model.

### `TValue`

Matches the type of the property that the rule is applied to.

### `AsyncValidator`

The [`AsyncValidator`](api/core/asyncValidator.md) generic class provided by **fluentvalidation-ts**.
