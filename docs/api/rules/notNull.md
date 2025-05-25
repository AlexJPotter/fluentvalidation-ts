---
id: notNull
title: '.notNull'
---

The `.notNull` rule is used to ensure that the value of a given property is not `null` (including `undefined` by default, though this is configurable).

:::tip

If you only want to check for `undefined` values, you may use the [`.notUndefined`](./notUndefined.md) rule instead.

:::

## Examples

### Default Usage

If you don't specify any options, the rule will check that the given value is not `null` or `undefined`.

In other words, the `includeUndefined` option is defaulted to `true` - this decision was made to avoid introducing a breaking change.

In this setup, both `null` and `undefined` values will be considered invalid.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  customerId?: number | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('customerId').notNull();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ customerId: 100 });
// ✔ {}

formValidator.validate({ customerId: null });
// ❌ { customerId: 'Value cannot be null' }

formValidator.validate({ customerId: undefined });
// ❌ { customerId: 'Value cannot be null' }

formValidator.validate({});
// ❌ { customerId: 'Value cannot be null' }
```

### Excluding `undefined`

The behaviour of the `.notNull` rule can be made "strict" (in the sense that it only checks for `null` and not `undefined`) by passing the `includeUndefined` option as `false`.

In this setup, `undefined` values will be allowed, and only `null` values will be considered invalid.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  customerId?: number | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    // highlight-next-line
    this.ruleFor('customerId').notNull({ includeUndefined: false });
  }
}

const formValidator = new FormValidator();

formValidator.validate({ customerId: 100 });
// ✔ {}

formValidator.validate({ customerId: null });
// ❌ { customerId: 'Value cannot be null' }

// highlight-start
formValidator.validate({ customerId: undefined });
// ✔ {}

formValidator.validate({});
// ✔ {}
// highlight-end
```

## Reference

### `.notNull(ruleOptions?: NotNullRuleOptions)`

A validation rule which ensures that the given property is not `null` (or `undefined`, depending on the value of `ruleOptions`).

The default value of `ruleOptions` is `{ includeUndefined: true }`, meaning that both `null` and `undefined` values will be considered invalid.

### `NotNullRuleOptions`

Equivalent to `{ includeUndefined: boolean }`, where the `includeUndefined` property determines whether `undefined` values should be considered invalid.

When `includeUndefined` is `true`, both `null` and `undefined` values will be considered invalid.

When `includeUndefined` is `false`, only `null` values will be considered invalid, and `undefined` values will be allowed.

## Example Message

> Value cannot be null
