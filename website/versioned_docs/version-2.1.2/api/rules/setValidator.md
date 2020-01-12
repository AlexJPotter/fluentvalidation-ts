---
id: version-2.1.2-setValidator
title: .setValidator
original_id: setValidator
---

The `.setValidator` rule is used to ensure that the value of a given `object` property is valid according to a given [`Validator`](api/core/validator.md).

The validator to use is specified by way of a producer function, which takes in the value of the base model and returns an appropriate validator.

This approach enables the nested validator to depend on the base model, and makes recursive validation possible.

## Examples

### Nested validator does not depend on the base model

In this example the nested validator has no dependency on the base model, so we can simply define an instance of the nested validator ahead of time and return that from the validator producer function.

```typescript
import { Validator } from 'fluentvalidation-ts';

type ContactDetails = {
  name: string;
  emailAddress: string;
};

class ContactDetailsValidator extends Validator<ContactDetails> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty();

    this.ruleFor('emailAddress').emailAddress();
  }
}

const contactDetailsValidator = new ContactDetailsValidator();

type FormModel = {
  contactDetails: ContactDetails;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('contactDetails').setValidator(() => contactDetailsValidator);
  }
}

const formValidator = new FormValidator();

formValidator.validate({
  contactDetails: { name: 'Alex', emailAddress: 'alex@example.com' },
});
// ✔ {}

formValidator.validate({
  contactDetails: { name: '', emailAddress: 'alex@example.com' },
});
// ❌ { contactDetails: { name: 'Value cannot be empty' } }
```

### Nested validator depends on the base model

In this example the nested validator has a constructor argument which changes its behaviour.

In particular, we only require an email address to be given if the user has indicated that they wish to sign up to the mailing list.

```typescript
import { Validator } from 'fluentvalidation-ts';

type ContactDetails = {
  name: string;
  emailAddress: string | null;
};

class ContactDetailsValidator extends Validator<ContactDetails> {
  constructor(emailAddressIsRequired: boolean) {
    super();

    this.ruleFor('name').notEmpty();

    this.ruleFor('emailAddress')
      .notNull()
      .when(() => emailAddressIsRequired);

    this.ruleFor('emailAddress').emailAddress();
  }
}

type FormModel = {
  signUpToMailingList: boolean;
  contactDetails: ContactDetails;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('contactDetails').setValidator(
      formModel => new ContactDetailsValidator(formModel.signUpToMailingList)
    );
  }
}

const formValidator = new FormValidator();

formValidator.validate({
  signUpToMailingList: false,
  contactDetails: { name: 'Alex', emailAddress: null },
});
// ✔ {}

formValidator.validate({
  signUpToMailingList: true,
  contactDetails: { name: 'Alex', emailAddress: null },
});
// ❌ { contactDetails: { emailAddress: 'Value cannot be null' } }
```

### Recursive validators

In this example we deal with validating a recursive (self-referencing) model.

In particular, an employee might have a line manager, who is also an employee. This line manager might themselves have a line manager, and so on.

```typescript
import { Validator } from 'fluentvalidation-ts';

type Employee = {
  name: string;
  lineManager: Employee | null;
};

class EmployeeValidator extends Validator<Employee> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty();

    this.ruleFor('lineManager').setValidator(() => new EmployeeValidator());
  }
}

const validator = new EmployeeValidator();

validator.validate({
  name: 'Bob',
  lineManager: {
    name: 'Alice',
    lineManager: null,
  },
});
// ✔ {}

validator.validate({
  name: 'Alex',
  lineManager: {
    name: '',
    lineManager: null,
  },
});
// ❌ { lineManager: { name: 'Value cannot be empty' } }
```

## Reference

### `.setValidator(validatorProducer: (model: TModel) => Validator<TValue>)`

A validation rule which takes in a validator producer function and ensures that the given property is valid according to the validator produced by that function.

### `TModel`

Matches the type of the base model.

### `TValue`

Matches the type of the property that the rule is applied to.

### `Validator`

The [`Validator`](api/core/validator.md) generic class provided by `fluentvalidation-ts`.
