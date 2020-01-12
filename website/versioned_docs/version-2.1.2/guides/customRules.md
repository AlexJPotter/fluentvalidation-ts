---
id: version-2.1.2-customRules
title: Custom Rules
original_id: customRules
---

One of the main features of fluentvalidation-ts is that it is fully extensible, allowing you define your own custom validation logic and inject it via the [`.must`](api/rules/must.md) rule.

The [documentation page](api/rules/must.md) for the `.must` rule contains several [examples](api/rules/must.md#examples) that demonstrate the different ways in which you can define and consume custom rules, as well as a full [API reference](api/rules/must.md#reference) which outlines everything in detail.

## The Gist

Custom validation logic is defined by way of a **predicate** function, which takes a value and returns a boolean (true/false) value indicating whether or not the value is valid.

You can pass custom validation logic directly into the `.must` rule with a predicate:

```typescript
this.ruleFor('numberOfSocks').must(numberOfSocks => numberOfSocks % 2 === 0);
```

If you want to reuse the logic, you could pull it out into a named function:

```typescript
const beEven = (value: number) => value % 2 === 0;
```

Then you can just pass the named function into `.must`, like so:

```typescript
this.ruleFor('numberOfSocks').must(beEven);
```

The predicate function can also depend on the value of the model as well as the value of the property:

```typescript
this.ruleFor('numberOfSocks').must(
  (numberOfSocks, model) => numberOfSocks === 2 * model.numberOfPants
);
```

You can define groups of rules by forming arrays:

```typescript
const beEven = (value: number) => value % 2 === 0;
const bePositive = (value: number) => value > 0;

const beEvenAndPositive = [beEven, bePositive];
```

These arrays can be passed directly to the `.must` rule:

```typescript
this.ruleFor('numberOfSocks').must(beEvenAndPositive);
```

You can also attach a custom message to your rule, alongside the predicate:

```typescript
const beEven = {
  predicate: (value: number) => value % 2 === 0,
  message: 'Please enter an even number',
};
```

As before, you just pass this into the `.must` rule directly:

```typescript
this.ruleFor('numberOfSocks').must(beEven);
```

Again, you can use arrays to compose rules together:

```typescript
const beEven = {
  predicate: (value: number) => value % 2 === 0,
  message: 'Please enter an even number',
};

const bePositive = {
  predicate: (value: number) => value > 0,
  message: 'Please enter a positive number',
};

const beEvenAndPositive = [beEven, bePositive];
```

You can even compose groups of rules together by spreading the arrays:

```typescript
const newRuleGroup = [...ruleGroup, ...otherRuleGroup];
```
