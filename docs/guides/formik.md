---
id: formik
title: Formik
---

When I first wrote **fluentvalidation-ts**, I had seamless integration with [Formik](https://formik.org/) in mind.

The [`ValidationErrors`](/docs/api/core/ValidationErrors) object returned by the [`.validate`](/docs/api/core/validator#validate) function has been designed to "just work" with Formik, so you can start using the two together with minimal effort.

If you're not familiar with Formik, it's a fantastic library for writing forms in [React](https://react.dev/).

## Usage

To use **fluentvalidation-ts** with Formik, simply define a `Validator` for your form model, instantiate an instance of your validator, then pass the validator's [`.validate`](https://formik.org/docs/guides/validation#validate) method to Formik's `validate` prop:

```tsx
import { Formik } from 'formik';
import { Validator } from 'fluentvalidation-ts';

type FormModel = { username: string };

// highlight-start
class MyFormValidator extends Validator<FormModel> {
  constructor() {
    super();
    this.ruleFor('username').notEmpty().withMessage('Please enter your username');
  }
}

const formValidator = new MyFormValidator();
// highlight-end

export const MyForm = () => (
  <Formik<FormModel>
    // highlight-next-line
    validate={formValidator.validate}
    ...
  >
    ...
  </Formik>
);
```
