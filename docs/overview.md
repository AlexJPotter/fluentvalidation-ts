---
id: overview
title: Overview
---

Front-end validation is a must-have for any project that involves forms, but the requirements vary hugely. You might have a simple sign-up form with a few text fields, or a complex configuration page with collections and deeply nested fields.

There are plenty of libraries out there which help you to solve the problem of front-end validation, but all the ones I've tried have felt lacking in one aspect or another - whether that's TypeScript support, their capacity to handle complex requirements, the ability to define your own reusable validation logic, or just the expressiveness of the API.

So I wrote **fluentvalidation-ts**, a tiny library that is:

- Designed for TypeScript
- Simple yet powerful
- Fully extensible

Whatever your validation needs, **fluentvalidation-ts** can handle them.

## Compatibility

**fluentvalidation-ts** is completely framework-agnostic, so you can use it with any front-end framework or library. It has no dependencies, and is designed to be as lightweight as possible. Having said that, it has primarily been designed to integrate seamlessly with popular form libraries for React - see the guides on [Formik](/docs/guides/formik) and [React Hook Form](/docs/guides/reactHookForm) for more information.

## Influences

If you've ever worked on a .NET API, you might have heard of a library called [FluentValidation](https://fluentvalidation.net/). It has a really nice API for building up validation rules, and that made me wonder whether I could achieve something similar in TypeScript. While **fluentvalidation-ts** is not a direct port, it will still feel very familiar to anyone who's used FluentValidation before.

## Installation

You can install **fluentvalidation-ts** with NPM/Yarn, or include it directly via a `<script>` tag.

### NPM/Yarn

With NPM:

```bash
npm install fluentvalidation-ts --save
```

or Yarn:

```bash
yarn add fluentvalidation-ts
```

### CDN

To target the latest version, add the following:

```html
<script src="https://unpkg.com/fluentvalidation-ts/dist/index.global.js"></script>
```

Or, to target a specific version (e.g. `4.0.0`), add the following:

```html
<script src="https://unpkg.com/fluentvalidation-ts@4.0.0/dist/index.global.js"></script>
```

Once you've done this, all you need is the `Validator` class which can be accessed via:

```js
window['fluentvalidation'].Validator;
```

## The Gist

To use **fluentvalidation-ts** simply import the `Validator` generic class, and define your own class which extends it using the appropriate generic type argument. Build up the rules for your various properties in the constructor of your derived class, then create an instance of your class to get hold of a validator. Finally, pass an instance of your model into the `.validate` function of your validator to obtain a validation errors object.

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
      .withMessage('Please enter a non-negative number');
  }
}

const formValidator = new FormValidator();

const valid: FormModel = {
  name: 'Alex',
  age: 26,
};
formValidator.validate(valid);
// {}

const invalid: FormModel = {
  name: '',
  age: -1,
};
formValidator.validate(invalid);
// { name: 'Please enter your name', age: 'Please enter a non-negative number' }
```
