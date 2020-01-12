---
id: overview
title: Overview
---

Front-end validation is a must-have for any project that involves forms, but the requirements vary hugely. You might have a simple sign-up form with a few text fields, or a complex configuration page with collections and deeply nested fields.

There are plenty of libraries out there which help you to solve the problem of front-end validation, but all the ones I've tried have felt lacking in one aspect or another - whether that's TypeScript support, their capacity to handle complex requirements, or the ability to define your own reusable validation logic.

So I wrote fluentvalidation-ts, a tiny library that is:

- Designed for TypeScript
- Simple yet powerful
- Fully extensible

Whatever your validation needs, fluentvalidation-ts can handle them.

## Motivation

In addition to the features mentioned above, one of the main motivators for writing fluentvalidation-ts was compatibility with [Formik](https://jaredpalmer.com/formik/). The errors object returned by fluentvalidation-ts has been designed to "just work" with Formik, so you can start using the two together with minimal effort. If you're not familiar with Formik, it's a fantastic library for writing forms in [React](https://reactjs.org/).

### Why not Yup?

If you're using TypeScript, chances are you've defined a type that describes your form model. Intuitively, you then want to define a validator which is tied to that type. This is exactly how fluentvalidation-ts works. If you need to make changes to the shape of your form model, you just update the base type. Those changes might cause your validator to break, but the compiler will let you know.

With [Yup](https://github.com/jquense/yup#typescript-support) you define your validation schema first, then infer the type of your form model from that. This gives you slightly less control over the typing of your form model, and forces you to modify your validation schema in order to make changes to it. Because Yup is written in JavaScript, you also have to install the TypeScript type definitions separately and keep them up to date.

There's no doubt that Yup is a great library, but it's painful to use with TypeScript.

## Influences

If you've ever worked on a .NET API, you might have heard of a library called [FluentValidation](https://fluentvalidation.net/). It has a really nice API for building up validation rules, and that made me wonder whether I could achieve something similar in TypeScript. While fluentvalidation-ts is not a direct port, it will still feel very familiar to anyone who's used FluentValidation before.

## Installation

You can install fluentvalidation-ts with NPM/Yarn, or include it directly via a `<script>` tag.

### NPM/Yarn

With NPM:

```
npm install fluentvalidation-ts --save
```

or Yarn:

```
yarn add fluentvalidation-ts
```

### CDN

To target the latest version, add the following:

```html
<script src="https://unpkg.com/fluentvalidation-ts/dist/fluentvalidation-ts.umd.production.min.js"></script>
```

Or, to target a specific version (e.g. `2.1.2`), add the following:

```html
<script src="https://unpkg.com/fluentvalidation-ts@2.1.2/dist/fluentvalidation-ts.umd.production.min.js"></script>
```

Once you've done this, all you need is the `Validator` class which can be accessed via:

```
window['fluentvalidation-ts'].Validator
```

### Try it in your browser

Click [here](https://codesandbox.io/embed/the-gist-fluentvalidation-ts212-p632d?fontsize=14&hidenavigation=1&theme=dark) to explore fluentvalidation-ts in your browser with CodeSandbox.

## The Gist

To use fluentvalidation-ts simply import the `Validator` generic class, and define your own class which extends it using the appropriate generic type argument. Build up the rules for your various properties in the constructor of your derived class, then create an instance of your class to get hold of a validator. Finally, pass an instance of your model into the `.validate` function of your validator to obtain a validation errors object.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  name: string;
  age: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .withMessage('Please enter your name');

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
