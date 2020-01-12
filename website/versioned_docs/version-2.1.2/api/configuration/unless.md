---
id: version-2.1.2-unless
title: .unless
original_id: unless
---

The `.unless` option is used to control when a rule or chain of rules should **not** execute.

By default, the `.unless` option will apply to all rules in the chain so far, but you can pass a second parameter to specify that it should only apply to the rule immediately preceding it.

## Examples

### Apply to all rules in the chain so far

In this example we apply an `.unless` condition to an entire rule chain.

In particular, we validate that the delivery note has been entered and is no more than 1,000 characters long unless it has been specified that a delivery note is not required.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  doesNotRequireDeliveryNote: boolean;
  deliveryNote: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('deliveryNote')
      .notNull()
      .notEmpty()
      .maxLength(1000)
      .unless(formModel => formModel.doesNotRequireDeliveryNote);
  }
}

const formValidator = new FormValidator();

formValidator.validate({
  doesNotRequireDeliveryNote: true,
  deliveryNote: null,
});
// ✔ {}

formValidator.validate({
  doesNotRequireDeliveryNote: false,
  deliveryNote: null,
});
// ❌ { deliveryNote: 'Value cannot be null' }
```

### Apply to a specific rule in the chain

In this example we apply an `.unless` condition to a specific rule in the chain.

In particular, we validate that an age has been entered, and also validate that it is at least 18 unless no alcoholic drink has been chosen.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  age: number | null;
  alcoholicDrink: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('age')
      .notNull()
      .greaterThanOrEqualTo(18)
      .unless(
        formModel => formModel.alcoholicDrink == null,
        'AppliesToCurrentValidator'
      );
  }
}

const formValidator = new FormValidator();

formValidator.validate({
  age: 17,
  alcoholicDrink: null,
});
// ✔ {}

formValidator.validate({
  age: 17,
  alcoholicDrink: 'Beer',
});
// ❌ { age: 'Value must be greater than or equal to 18' }

formValidator.validate({
  age: null,
  alcoholicDrink: null,
});
// ❌ { age: 'Value cannot be null' }
```

## Reference

### `.unless(condition: (model: TModel) => boolean, appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator')`

A configuration option which controls when a particular rule or chain of rules should not execute.

### `condition`

This is a function which accepts the value of the base model and returns a `boolean` indicating whether the rule or chain of rules preceding it should not execute.

A return value of `true` indicates that the rule or chain of rules **should not** execute.

Conversely, a return value of `false` indicates that the rule or chain of rules **should** execute.

### `TModel`

Matches the type of the base model.

### `appliesTo`

This is an optional parameter which can be used to control whether the condition applies to all rules in the chain so far, or just the rule immediately preceding the call to `.unless`.

By default, this parameter is set to `'AppliesToAllValidators'`, which means that the `.unless` condition applies to all rules in the current chain.

Setting this value to `'AppliesToCurrentValidator'` specifies that the `.unless` condition only controls the execution of the rule immediately preceding it in the current chain.
