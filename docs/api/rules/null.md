---
id: nullRule
title: '.null'
---

The `.null` rule is used to ensure that the value of a given property is `null` (or `undefined` by default, though this is configurable).

:::tip

If you only want to check for `undefined` values, you may use the [`.undefined`](./undefined.md) rule instead.

:::

## Examples

### Default Usage

If you don't specify any options, the rule will check that the given value is `null` or `undefined`.

In other words, the `includeUndefined` option is defaulted to `true` - this decision was made to avoid introducing a breaking change.

In this setup, both `null` and `undefined` values will be considered valid.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  apiError?: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('apiError').null();
  }
}

const formValidator = new FormValidator();

formValidator.validate({ apiError: null });
// ✔ {}

formValidator.validate({ apiError: 'Failed to fetch data from the API' });
// ❌ { apiError: 'Value must be null' }

formValidator.validate({ apiError: undefined });
// ✔ {}

formValidator.validate({});
// ✔ {}
```

### Excluding `undefined`

The behaviour of the `.null` rule can be made "strict" (in the sense that it only checks for `null` and not `undefined`) by passing the `includeUndefined` option as `false`.

In this setup, `undefined` values will be considered invalid, and only `null` values will be allowed.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  apiError?: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('apiError').null({ includeUndefined: false });
  }
}

const formValidator = new FormValidator();

formValidator.validate({ apiError: null });
// ✔ {}

formValidator.validate({ apiError: 'Failed to fetch data from the API' });
// ❌ { apiError: 'Value must be null' }

// highlight-start
formValidator.validate({ apiError: undefined });
// ❌ { apiError: 'Value must be null' }

formValidator.validate({});
// ❌ { apiError: 'Value must be null' }
// highlight-end
```

## Reference

### `.null(ruleOptions?: NullRuleOptions)`

A validation rule which ensures that the given property is `null` (or `undefined`, depending on the value of `ruleOptions`).

The default value of `ruleOptions` is `{ includeUndefined: true }`, meaning that both `null` and `undefined` values will be considered valid.

### `NullRuleOptions`

Equivalent to `{ includeUndefined: boolean }`, where the `includeUndefined` property determines whether `undefined` values should be considered valid.

When `includeUndefined` is `true`, both `null` and `undefined` values will be considered valid.

When `includeUndefined` is `false`, only `null` values will be considered valid, and `undefined` values will be considered invalid.

## Example Message

> Value must be null
