---
id: objectProperties
title: Object Properties
---

Object properties can be validated by way of the [`.setValidator`](api/rules/setValidator.md) rule.

The [documentation page](api/rules/setValidator.md) for the `.setValidator` rule contains several [examples](api/rules/setValidator.md#examples) that demonstrate the different ways in which you can use it, as well as a full [API reference](api/rules/setValidator.md#reference) which outlines everything in detail.

## The Gist

You can validate an object property using the built-in rules:

```typescript
this.ruleFor('pet')
  .notNull()
  .must(pet => pet.age >= 0)
  .must(pet => pet.name !== '');
```

Alternatively, you can define a validator for the type of the object property:

```typescript
class PetValidator extends Validator<Pet> {
  constructor() {
    super();
    this.ruleFor('age').greaterThanOrEqualTo(0);
    this.ruleFor('name').notEmpty();
  }
}

const petValidator = new PetValidator();
```

This can then be passed in with the `.setValidator` rule:

```typescript
this.ruleFor('pet')
  .notNull()
  .setValidator(() => petValidator);
```
