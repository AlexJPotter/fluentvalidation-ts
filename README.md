# fluentvalidation-ts

[![CI](https://github.com/AlexJPotter/fluentvalidation-ts/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AlexJPotter/fluentvalidation-ts/actions/workflows/ci.yml)
![Coverage](https://badgen.net/badge/coverage/100%25/green?icon=codecov)
![Dependencies](https://badgen.net/badge/dependencies/none/green)
[![GZIP Size](https://img.badgesize.io/https://unpkg.com/fluentvalidation-ts@latest/dist/index.js?compression=gzip)](https://unpkg.com/fluentvalidation-ts@latest/dist/index.js)

[![NPM Version](https://badgen.net/npm/v/fluentvalidation-ts?icon=npm)](https://www.npmjs.com/package/fluentvalidation-ts)
![License](https://badgen.net/npm/license/fluentvalidation-ts)
![Last Commit](https://badgen.net/github/last-commit/alexjpotter/fluentvalidation-ts/main?icon=github)
[![Open Issues](https://badgen.net/github/open-issues/alexjpotter/fluentvalidation-ts?icon=github)](https://github.com/AlexJPotter/fluentvalidation-ts/issues)

## Strong, simple, extensible validation.

Visit [https://fluentvalidation-ts.alexpotter.dev](https://fluentvalidation-ts.alexpotter.dev) to get started.

## Overview

Front-end validation is a must-have for any project that involves forms, but the requirements vary hugely. You might have a simple sign-up form with a few text fields, or a complex configuration page with collections and deeply nested fields.

There are plenty of libraries out there which help you to solve the problem of front-end validation, but all the ones I've tried have felt lacking in one aspect or another - whether that's TypeScript support, their capacity to handle complex requirements, or the ability to define your own reusable validation logic.

So I wrote **fluentvalidation-ts**, a tiny library that is:

- Designed for **TypeScript**
- Simple yet powerful
- Fully extensible

Whatever your validation needs, **fluentvalidation-ts** can handle them.

## Docs

Full documentation, including a tutorial and a number of useful guides, is available on the [documentation website](https://fluentvalidation-ts.alexpotter.dev).

- [Overview](https://fluentvalidation-ts.alexpotter.dev/docs/overview)
- [Tutorial](https://fluentvalidation-ts.alexpotter.dev/docs/tutorial)
- [Guides](https://fluentvalidation-ts.alexpotter.dev/docs/guides/customrules)
- [Core API Reference](https://fluentvalidation-ts.alexpotter.dev/docs/api/core/validator)
- [Validation Rules API Reference](https://fluentvalidation-ts.alexpotter.dev/docs/api/rules/emailaddress)
- [Releases](https://github.com/AlexJPotter/fluentvalidation-ts/releases)

### Requirements

This library has been written in, and for, **TypeScript**. You can still use **fluentvalidation-ts** without TypeScript, but the primary benefit of having strongly-typed validation rules is lost.

If using TypeScript (strongly recommended), you must be on TypeScript version **`2.9`** or later.

### Installation

Using NPM:

```
npm i --save fluentvalidation-ts
```

Using Yarn:

```
yarn add fluentvalidation-ts
```

> [!TIP]
> There's no need to install types separately - **fluentvalidation-ts** has been written with first-class support for TypeScript!

### Example Usage

```typescript
import { Validator } from 'fluentvalidation-ts';

type Person = {
  name: string;
  age: number;
};

class PersonValidator extends Validator<Person> {
  constructor() {
    super();

    this.ruleFor('name') // This is type-safe! (Argument is of type 'name' | 'age')
      .notEmpty()
      .withMessage('Please enter your name');

    this.ruleFor('age').greaterThanOrEqualTo(0).withMessage('Age cannot be negative');
  }
}

const validator = new PersonValidator();

validator.validate({ name: '', age: 25 });
// { name: 'Please enter your name' }

validator.validate({ name: 'Alex', age: -1 });
// { age: 'Age cannot be negative' }

validator.validate({ name: '', age: -1 });
// { name: 'Please enter your name', age: 'Age cannot be negative' }
```

### Test Coverage

**fluentvalidation-ts** has 100% test coverage via unit tests written with [Jest](https://jestjs.io/).

> [!NOTE]
> Some branches are incorrectly reported as uncovered due to the following issue: [https://github.com/gotwarlost/istanbul/issues/690](https://github.com/gotwarlost/istanbul/issues/690).

### Issues

Please report issues via [GitHub](https://github.com/AlexJPotter/fluentvalidation-ts/issues).

### License

**fluentvalidation-ts** is provided under the terms of an [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

### Development

Clone the repo and run `npm install`, then run `npm run watch` in the root of the project to start the TypeScript compiler in watch mode. You can run the tests with `npm test`.

### About the Author

Alex Potter is a full-stack Software Engineer, currently working as a Technical Lead at [Ghyston](https://www.ghyston.com), an award-winning software development company based in Bristol.
