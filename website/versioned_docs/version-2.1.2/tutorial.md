---
id: version-2.1.2-tutorial
title: Tutorial
original_id: tutorial
---

## Introduction

This tutorial will walk you through some of the core features of fluentvalidation-ts. We'll start off with a simple form model and a correspondingly simple validator. As the tutorial goes on we'll add more fields to our form model and dive deeper into what we can do with our validator.

I recommend that you work through this tutorial in order, and follow along by running the code locally (or in an online sandbox).

## Setup

If you plan on following along by running the code yourself, you have two options:

- Install fluentvalidation-ts to your project via NPM/Yarn (see [these](overview.md#installation) instructions)
- Run the code in your browser via CodeSandbox (more information [here](overview.md#try-it-in-your-browser))

For this tutorial we'll asssume that you're using [TypeScript](https://www.typescriptlang.org/). It is still possible to use fluentvalidation-ts without TypeScript, but you'll lose a lot of the main benefits.

## The Basics

To begin with, let's define our form model:

```typescript
type FormModel = {
  name: string;
  age: number;
};
```

As you can see, we're imagining a very basic form with just two simple fields.

Now, let's define a validator for this form model. First we need to import the [`Validator`](api/core/validator.md) class. Add the following to the top of your file:

```typescript
import { Validator } from 'fluentvalidation-ts';
```

Once we have the `Validator` base class, we can define our own validator by extending it. Underneath where we've defined `FormModel`, add the following:

```typescript
class FormValidator extends Validator<FormModel> {}
```

Next, we can add rules for our properties in the constructor of our validator using the [`.ruleFor`](api/core/ruleFor.md) method:

```typescript
class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .maxLength(100);

    this.ruleFor('age').greaterThanOrEqualTo(0);
  }
}
```

If you're feeling adventurous, try adding another rule or two to each property.

Now, to actually validate an instance of our form model we first need to create an instance of our validator. Underneath the definition for `FormValidator` add the following:

```typescript
const formValidator = new FormValidator();
```

We can validate instances of our form model by passing them into the `.validate` method of our validator:

```typescript
const valid: FormModel = { name: 'Alex', age: 26 };
console.log(formValidator.validate(valid)); // {}

const invalid: FormModel = { name: '', age: 26 };
console.log(formValidator.validate(invalid)); // { name: 'Value cannot be empty' }
```

As you can see, the validation result is an object with an appropriate property for each invalid field on the given form model.

Try experimenting with some different values for each field to get used to the shape of the errors object.

## Custom Messages

All the built-in validation rules come equipped with a sensible error message that is exposed via the errors object if validation fails.

To specify your own message to be used instead, simply call [`.withMessage`](api/configuration/withMessage.md) after the rule definition and pass in your own message.

Modify the rule chain for the name property as follows:

```typescript
this.ruleFor('name')
  .notEmpty()
  .withMessage('Please enter your name')
  .maxLength(100);
```

Now, if we validate an invalid form model:

```typescript
const invalid: FormModel = { name: '', age: 26 };
console.log(formValidator.validate(invalid)); // { name: 'Please enter your name' }
```

Note that `.withMessage` only applies to the rule immediately preceding it in the rule chain, not to all rules in the chain so far.

## Conditional Rules

Sometimes you only want particular rules or rule chains to apply under certain circumstances.

Let's add a couple of properties to our form model:

```typescript
type FormModel = {
  name: string;
  age: number;
  hasPet: boolean;
  nameOfPet: string | null;
};
```

If the person indicates that they have a pet then we'd like to enforce that they enter their pet's name. Likewise, if they don't have a pet we want to ensure that the pet name field is not filled out.

We can make use of the [`.when`](api/configuration/when.md) and [`.unless`](api/configuration/unless.md) configuration methods to achieve this.

Add the following to the end of your constructor (underneath the rules for the name and age fields):

```typescript
this.ruleFor('nameOfPet')
  .notNull()
  .notEmpty()
  .when(formModel => formModel.hasPet);

this.ruleFor('nameOfPet')
  .null()
  .unless(formModel => formModel.hasPet);
```

Now if we validate some invalid form models:

```typescript
const invalidWithPet: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: true,
  nameOfPet: '',
};
console.log(formValidator.validate(invalidWithPet)); // { nameOfPet: 'Value cannot be empty' }

const invalidWithoutPet: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: false,
  nameOfPet: 'Doggy',
};
console.log(formValidator.validate(invalidWithoutPet)); // { nameOfPet: 'Value must be null' }
```

In this example each condition applies to the entire rule chain preceding it, but you can also specify that a condition applies only to the preceding rule in the chain. See the relevant documentation pages for [`.when`](api/configuration/when.md) and [`.unless`](api/configuration/unless.md) to find out more.

## Collections

So far our form model has only contained simple fields, but many forms involve collections.

Let's add another field to our form model:

```typescript
type FormModel = {
  name: string;
  age: number;
  hasPet: boolean;
  nameOfPet: string | null;
  hobbies: Array<string>;
};
```

Now suppose we want to validate that each entry in the hobbies array is non-empty and no longer than 100 characters in length.

To achieve this we can make use of the convenient [`.ruleForEach`](api/core/ruleForEach) method.

Add the following to the end of your constructor:

```typescript
this.ruleForEach('hobbies')
  .notEmpty()
  .maxLength(100);
```

Now, if we validate some form models:

```typescript
const valid: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: false,
  nameOfPet: null,
  hobbies: ['Coding', 'Music', 'Eating'],
};
console.log(formValidator.validate(valid)); // {}

const invalid: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: false,
  nameOfPet: null,
  hobbies: ['Coding', '', 'Eating'],
};
console.log(formValidator.validate(invalid)); // { hobbies: [null, 'Value cannot be empty', null] }
```

As you can see, when a particular element of an array property is invalid, the resulting property on the errors object is itself an array, with an appropriate error message at the index of the invalid item. The value at the index of each valid item is `null`. It's worth noting that this behaviour has been specially designed to work with [Formik](https://jaredpalmer.com/formik/).

## Nested Fields

Our form model has become a bit more complex, but it still has a fairly flat structure.

Let's make the pet field an object rather than a string:

```typescript
type FormModel = {
  name: string;
  age: number;
  hasPet: boolean;
  pet: Pet | null;
  hobbies: Array<string>;
};

type Pet = {
  name: string;
  species: string;
};
```

You'll notice that we now get a compilation error in the constructor of our existing validator, because the `nameOfPet` field no longer exists. Don't worry, we'll fix that in a moment.

We can now define another validator, this time for the `Pet` type.

Add the following just above where you've defined the `FormValidator` class:

```typescript
class PetValidator extends Validator<Pet> {
  constructor() {
    super();

    this.ruleFor('name')
      .notEmpty()
      .maxLength(100);

    this.ruleFor('species')
      .notEmpty()
      .maxLength(100);
  }
}

const petValidator = new PetValidator();
```

We can specify that the pet field on our form model should be validated according to this new validator by using the [`.setValidator`](api/rules/setValidator) rule.

Modify the constructor of the `FormValidator` class by changing the rules that are targeting the non-existent `nameOfPet` field:

```typescript
this.ruleFor('pet')
  .notNull()
  .setValidator(() => petValidator)
  .when(formModel => formModel.hasPet);

this.ruleFor('pet')
  .null()
  .unless(formModel => formModel.hasPet);
```

Now, if we validate some form models:

```typescript
const valid: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: true,
  pet: { name: 'Doggy', species: 'Dog' },
  hobbies: ['Coding', 'Music', 'Eating'],
};
console.log(formValidator.validate(valid)); // {}

const invalid: FormModel = {
  name: 'Alex',
  age: 26,
  hasPet: true,
  pet: { name: '', species: 'Cat' },
  hobbies: ['Coding', 'Music', 'Eating'],
};
console.log(formValidator.validate(invalid)); // { pet: { name: 'Value cannot be empty' } }
```

As you can see, when a particular element of an object property is invalid, the resulting property on the errors object is itself an object. This object is exactly the errors object produced by validating the property according to the validator you specified.

It's worth noting that the `.setValidator` rule takes a function, a validator producer, rather than just a validator. This allows the validator to depend on the model you're validating, and makes recursive validation possible. See the documentation page for the [`.setValidator`](api/rules/setValidator) rule to find out more.

## Custom Rules

So far we've relied on the built-in validation rules to define our validation logic, but sometimes it's necessary to define your own custom validation logic.

Let's suppose that the age field is implemented on our form as a text input, so the associated property on the form model needs to be a string:

```typescript
type FormModel = {
  name: string;
  age: string;
  hasPet: boolean;
  pet: Pet | null;
  hobbies: Array<string>;
};
```

This change will break our validator, because the `.greaterThanOrEqualTo` rule is not appropriate for string properties.

In place of the `.greaterThanOrEqualTo` rule, we can use the [`.must`](api/rules/must) rule to define our own validation logic.

Modify the rule chain for the age property as follows:

```typescript
this.ruleFor('age')
  .notEmpty()
  .must(age => !isNaN(Number(age)))
  .must(age => Number(age) >= 0);
```

These rules validate that the age field is not empty, is numeric, and has a numeric value that is non-negative.

Now, if we validate some form models:

```typescript
const valid: FormModel = {
  name: 'Alex',
  age: '26',
  hasPet: true,
  pet: { name: 'Doggy', species: 'Dog' },
  hobbies: ['Coding', 'Music', 'Eating'],
};
console.log(formValidator.validate(valid)); // {}

const invalid: FormModel = {
  name: 'Alex',
  age: 'foo',
  hasPet: true,
  pet: { name: 'Doggy', species: 'Dog' },
  hobbies: ['Coding', 'Music', 'Eating'],
};
console.log(formValidator.validate(invalid)); // { age: 'Value is not valid' }
```

As you can see, the default error message for the `.must` rule isn't very descriptive, so lets's add some custom error messages:

```typescript
this.ruleFor('age')
  .notEmpty()
  .must(age => !isNaN(Number(age)))
  .withMessage('Please enter a number')
  .must(age => Number(age) >= 0)
  .withMessage('Please enter a non-negative number');
```

Now, let's suppose we have many other forms in our application, and some of those also have numeric fields which are entered via text inputs.

Rather than repeating the validation logic across validators for our different forms, let's extract it so we can reuse it.

Add the following above the definition of the `FormValidator` class:

```typescript
const beNumeric = (value: string) => !isNaN(Number(value));

const beNonNegative = (value: string) => Number(value) >= 0;
```

Now, modify the rule chain for the age property as follows:

```typescript
this.ruleFor('age')
  .notEmpty()
  .must(beNumeric)
  .withMessage('Please enter a number')
  .must(beNonNegative)
  .withMessage('Please enter a non-negative number');
```

This hasn't really changed anything, but we can now use the logic defined in `beNumeric` and `beNonNegative` across many different validators.

This is great, but you might have noticed that we still need to define our custom messages each time. Fortunately, the `.must` rule has an override that allows us to pass in both custom validation logic and a custom message.

Change the definitions of `beNumeric` and `beNonNegative` to the following:

```typescript
const beNumeric = {
  predicate: (value: string) => !isNaN(Number(value)),
  message: 'Please enter a number',
};

const beNonNegative = {
  predicate: (value: string) => Number(value) >= 0,
  message: 'Please enter a non-negative number',
};
```

We can now remove the calls to `.withMessage` in our rule chain:

```typescript
this.ruleFor('age')
  .notEmpty()
  .must(beNumeric)
  .must(beNonNegative);
```

As you can see, the `.must` rule is a very powerful tool, and this example only scratches the surface of what's possible with it. For full details, see the [documentation page](api/rules/must).
