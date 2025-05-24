---
id: validationErrors
title: ValidationErrors
---

Calling `.validate` on an instance of a validator returns an object of type `ValidationErrors<TModel>`, which represents the validity of the model that was passed in, and exposes relevant error messages.

Consider the following example:

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  name: string;
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty().withMessage('Please enter your name');

    this.ruleFor('age')
      .greaterThanOrEqualTo(0)
      .withMessage('Your age must be a positive number');
  }
}

const formValidator = new FormValidator();
```

Each property on the model is either valid or invalid according to the validator. If a property is valid then there will be no corresponding property on the validation errors object.

```typescript
formValidator.validate({ name: 'Alex', age: 26 });
// {}
```

On the other hand, if a property is invalid then there will be a corresponding property on the validation errors object.

For simple properties (`string`, `boolean`, `number`, etc.) the value of this corresponding property is always a `string` error message.

```typescript
formValidator.validate({ name: '', age: 26 });
// { name: 'Please enter your name' }
```

In any case, the error results from the **first** failing validation rule for that property.

> Being aware of this behaviour is very important, as it can influence the order in which you wish to define rules for your properties.

For object properties and array properties the corresponding value on the errors object looks slightly different - in particular it is not always a `string`.

## Object properties

Object properties contain nested properties, which could have validation rules of their own (by way of the `.setValidator` rule). As a result, validation for the base model could fail because a nested property on a particular object property is invalid.

Consider the following example:

```typescript
import { Validator } from 'fluentvalidation-ts';

type ContactDetails = {
  name: string;
  emailAddress: string;
};

class ContactDetailsValidator extends Validator<ContactDetails> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty().withMessage('Please enter your name');

    this.ruleFor('emailAddress')
      .emailAddress()
      .withMessage('Please enter a valid email address');
  }
}

const contactDetailsValidator = new ContactDetailsValidator();

type FormModel = { contactDetails: ContactDetails };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('contactDetails').setValidator(() => contactDetailsValidator);
  }
}

const formValidator = new FormValidator();
```

In this example the base model has a `contactDetails` property on it, which is an object (of type `ContactDetails`). This property is validated according to the `ContactDetailsValidator` validator.

If a valid value is provided, then the errors object has no corresponding property on it (as with simple properties).

```typescript
formValidator.validate({
  contactDetails: { name: 'Alex', emailAddress: 'alex@example.com' },
});
// {}
```

However, if an invalid value is provided, then the errors object has a corresponding property on it. The value of this property is essentially the errors object that you get by calling `.validate` on `contactDetailsValidator` with the value of `contactDetails`.

```typescript
formValidator.validate({
  contactDetails: { name: '', emailAddress: 'alex@example.com' },
});
// { contactDetails: { name: 'Please enter your name' } }
```

With **fluentvalidation-ts** you can have arbitrary levels of nested object properties on your model and the resulting errors object will have a corresponding structure.

It's worth pointing out that if you specify a rule on an object property directly (i.e. a rule other than the `.setValidator` rule) then you'll end up with a `string` value in the errors object if that validation rule fails (and is before any failing `.setValidator` rules in the chain).

```typescript
import { Validator } from 'fluentvalidation-ts';

type ContactDetails = {
  name: string;
  emailAddress: string;
};

class ContactDetailsValidator extends Validator<ContactDetails> {
  constructor() {
    super();

    this.ruleFor('name').notEmpty().withMessage('Please enter your name');

    this.ruleFor('emailAddress')
      .emailAddress()
      .withMessage('Please enter a valid email address');
  }
}

const contactDetailsValidator = new ContactDetailsValidator();

type FormModel = { contactDetails: ContactDetails | null };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('contactDetails')
      .notNull() // <--- If this rule fails we'll get a `string` error in the errors object
      .setValidator(() => contactDetailsValidator);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ contactDetails: null });
// { contactDetails: 'Value cannot be null' }
```

## Array properties

Array properties can contain an arbitrary number of elements, each of which could be valid or invalid at an item level (by way of a rule defined in a `.ruleForEach` rule chain). As a result, validation for the array property could fail because a particular element in the array is invalid.

Consider the following example:

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = { scores: Array<number> };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleForEach('scores').inclusiveBetween(1, 10);
  }
}

const formValidator = new FormValidator();
```

In this example the base model has a `scores` property on it, and we've specified that each element within that array should be between `1` and `10` (inclusive).

If a valid value is provided, then the errors object has no corresponding property on it (as with simple properties).

```typescript
formValidator.validate({ scores: [1, 3, 4, 9] });
// {}
```

However, if an invalid value is provided, then the errors object has a corresponding property on it. The value of this property is an array where each element is either `null` (if the corresponding element is valid) or an appropriate errors object (if the corresponding element is invalid).

In this case, each element of the array property is a flat type (`number`), so any corresponding errors will just be of type `string`.

```typescript
formValidator.validate({ scores: [1, -3, 4, 11] });
/*
  {
    scores: [
      null,
      'Value must be between 1 and 10 (inclusive)',
      null,
      'Value must be between 1 and 10 (inclusive)'
    ],
  }
*/
```

In this example we have an array of `number` elements, but we could just as easily have an array of `object` elements which might be validated by way of a `.setValidator` rule. In that case, the elements in the array on the errors object could themselves be of type `object` (as explained above).

It's worth pointing out that if you specify a rule on an array property directly (i.e. a rule defined via `.ruleFor` as opposed to `.ruleForEach`) then you'll end up with a `string` value in the errors object if that validation rule fails.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = { scores: Array<number> };

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('scores')
      .must((scores) => scores.length > 0)
      .withMessage('Cannot be empty');

    this.ruleForEach('scores').inclusiveBetween(1, 10);
  }
}

const formValidator = new FormValidator();

formValidator.validate({ scores: [] });
// { scores: 'Cannot be empty' }
```
