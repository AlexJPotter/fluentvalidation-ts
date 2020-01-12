<div align="center" style="background-color: #141c2f; padding: 30px 0 10px 0">
  <img
    height="75"
    alt="Logo."
    src="https://alexpotter.dev/fluentvalidation-ts/img/logo-text.svg"
  />
  <h2>Strong, simple, extensible validation.</h2>
</div>

<br />

![Coverage](https://badgen.net/badge/coverage/100%25/green)
[![NPM Version](https://badgen.net/npm/v/fluentvalidation-ts)](https://www.npmjs.com/package/fluentvalidation-ts)
![License](https://badgen.net/npm/license/fluentvalidation-ts)
![Last Commit](https://badgen.net/github/last-commit/alexjpotter/fluentvalidation-ts/master)
![Open Issues](https://badgen.net/github/open-issues/alexjpotter/fluentvalidation-ts)

![Dependencies](https://badgen.net/badge/dependencies/none/green)
[![GZIP Size](http://img.badgesize.io/https://unpkg.com/fluentvalidation-ts@latest/dist/fluentvalidation-ts.umd.production.min.js?compression=gzip)](https://unpkg.com/fluentvalidation-ts@latest/dist/fluentvalidation-ts.umd.production.min.js)

<hr />

Visit [https://alexpotter.dev/fluentvalidation-ts](https://alexpotter.dev/fluentvalidation-ts) to get started with fluentvalidation-ts.

<hr />

Front-end validation is a must-have for any project that involves forms, but the requirements vary hugely. You might have a simple sign-up form with a few text fields, or a complex configuration page with collections and deeply nested fields.

There are plenty of libraries out there which help you to solve the problem of front-end validation, but all the ones I've tried have felt lacking in one aspect or another - whether that's TypeScript support, their capacity to handle complex requirements, or the ability to define your own reusable validation logic.

So I wrote fluentvalidation-ts, a tiny library that is:

- Designed for TypeScript
- Simple yet powerful
- Fully extensible

Whatever your validation needs, fluentvalidation-ts can handle them.

<hr />

## Docs

Full documentation, including a tutorial and a number of useful guides, is available at the [official fluentvalidation-ts website](https://alexpotter.dev/fluentvalidation-ts).

* [Overview](https://alexpotter.dev/fluentvalidation-ts/docs/overview)
* [Tutorial](https://alexpotter.dev/fluentvalidation-ts/docs/tutorial)
* [Guides](https://alexpotter.dev/fluentvalidation-ts/docs/guides/customrules)
* [Core API Reference](https://alexpotter.dev/fluentvalidation-ts/docs/api/core/validator)
* [Validation Rules API Reference](https://alexpotter.dev/fluentvalidation-ts/docs/api/rules/emailaddress)
* [Releases](https://github.com/AlexJPotter/fluentvalidation-ts/releases)

<hr />

### Requirements

This library has been written in, and for, TypeScript. You can still use `fluentvalidation-ts` without TypeScript, but the primary benefit of having strongly-typed validation rules is lost.

If using TypeScript (strongly recommended), you must be on TypeScript version **2.9** or later.

### Installation

Using Yarn:

```
yarn add fluentvalidation-ts
```

Using NPM:

```
npm i --save fluentvalidation-ts
```

**Note:** `fluentvalidation-ts` has been written with first-class support for TypeScript, so there's no need to install types!

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

    this.ruleFor('age')
      .greaterThanOrEqualTo(0)
      .withMessage('Age cannot be negative');
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

`fluentvalidation-ts` has 100% test coverage via unit tests written with [Jest](https://jestjs.io/).

### Issues

Please report issues via GitHub.

### License

`fluentvalidation-ts` is provided under the terms of an [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license.

### About the Author

Alex Potter is a full-stack Software Developer who is currently part of the team at [Ghyston](https://www.ghyston.com), an award-winning software development company based in Bristol.

Get in touch [@ajp_dev](https://twitter.com/ajp_dev) on Twitter, or via [LinkedIn](www.linkedin.com/in/alex-james-potter).
