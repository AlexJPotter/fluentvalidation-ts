---
id: version-2.1.2-arrayProperties
title: Array Properties
original_id: arrayProperties
---

Validating array properties is made easy with the [`.ruleForEach`](api/core/ruleForEach.md) method.

The `.ruleForEach` method works almost exactly the same as the [`.ruleFor`](api/core/ruleFor.md) method, so it's worth reading up on that first if you haven't already.

## The Gist

You can validate an array property using the `.ruleFor` method:

```typescript
this.ruleFor('scores').must(
  scores => scores.filter(score => score < 0 || score > 100).length === 0
);
```

Alternatively, you can use the `.ruleForEach` method:

```typescript
this.ruleForEach('scores')
  .greaterThanOrEqualTo(0)
  .lessThanOrEqualTo(100);
```
