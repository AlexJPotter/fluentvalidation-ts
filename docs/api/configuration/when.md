---
id: when
title: '.when'
---

The `.when` option is used to control when a rule or chain of rules should execute.

By default, the `.when` option will apply to all rules in the chain so far, but you can pass a second parameter to specify that it should only apply to the rule immediately preceding it.

:::note

In the case that there are multiple `.when` and/or `.unless` conditions in the rule chain, each condition applies only to the rules defined **between it and the previous condition**.

:::

## Examples

### Apply to all rules in the chain so far

In this example we apply a `.when` condition to an entire rule chain.

In particular, we validate that the delivery note has been entered and is no more than 1,000 characters long when it has been specified that a delivery note is required.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  requiresDeliveryNote: boolean;
  deliveryNote: string | null;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('deliveryNote')
      .notNull()
      .notEmpty()
      .maxLength(1000)
      // highlight-next-line
      .when((formModel) => formModel.requiresDeliveryNote);
  }
}

const formValidator = new FormValidator();

formValidator.validate({
  requiresDeliveryNote: false,
  deliveryNote: null,
});
// ✔ {}

formValidator.validate({
  requiresDeliveryNote: true,
  deliveryNote: null,
});
// ❌ { deliveryNote: 'Value cannot be null' }
```

### Multiple calls within the same chain

In this example we apply multiple `.when` conditions within the same rule chain.

In particular, we validate that Sunday delivery rates are only applied when the delivery day is a Sunday.

```typescript
import { Validator } from 'fluentvalidation-ts';

type FormModel = {
  deliveryDay: string;
  deliveryRate: number;
};

class FormValidator extends Validator<FormModel> {
  constructor() {
    super();

    this.ruleFor('deliveryRate')
      .equal(4.99)
      .withMessage('Sunday rates must apply if delivery day is Sunday')
      // highlight-next-line
      .when((formModel) => formModel.deliveryDay === 'Sunday')
      .equal(2.99)
      .withMessage('Standard rates must apply if delivery day is Monday to Saturday')
      // highlight-next-line
      .when((formModel) => formModel.deliveryDay !== 'Sunday');
  }
}

const formValidator = new FormValidator();

formValidator.validate({ deliveryDay: 'Sunday', deliveryRate: 4.99 });
// ✔ {}

formValidator.validate({ deliveryDay: 'Sunday', deliveryRate: 2.99 });
// ❌ { deliveryRate: 'Sunday rates must apply if delivery day is Sunday' }

formValidator.validate({ deliveryDay: 'Monday', deliveryRate: 2.99 });
// ✔ {}

formValidator.validate({ deliveryDay: 'Monday', deliveryRate: 4.99 });
// ❌ { deliveryRate: 'Standard rates must apply if delivery day is Monday to Saturday' }
```

### Apply to a specific rule in the chain

In this example we apply a `.when` condition to a specific rule in the chain.

In particular, we validate that an age has been entered, and also validate that it is at least 18 when an alcoholic drink has been chosen.

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
      // highlight-start
      .when((formModel) => formModel.alcoholicDrink != null, 'AppliesToCurrentValidator');
    // highlight-end
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

### `.when(condition: (model: TModel) => boolean, appliesTo?: 'AppliesToAllValidators' | 'AppliesToCurrentValidator')`

A configuration option which controls when a particular rule or chain of rules should execute.

### `condition`

This is a function which accepts the value of the base model and returns a `boolean` indicating whether the rule or chain of rules preceding it should execute.

A return value of `true` indicates that the rule or chain of rules **should** execute.

Conversely, a return value of `false` indicates that the rule or chain of rules **should not** execute.

### `TModel`

Matches the type of the base model.

### `appliesTo`

This is an optional parameter which can be used to control which rules in the current rule chain the condition applies to.

A value of `'AppliesToAllValidators'` means that the `.when` condition applies to all rules in the current rule chain so far. If there are other calls to `.when` or `.unless` in the chain, only the rules defined since the most recent condition will have the condition applied to them.

A value of `'AppliesToCurrentValidator'` specifies that the `.when` condition only controls the execution of the rule immediately preceding it in the current rule chain.

By default, the `appliesTo` parameter is set to `'AppliesToAllValidators'`.
