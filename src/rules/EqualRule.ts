import { Rule } from './Rule';

export class EqualRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(requiredValue: TValue) {
    super((value: TValue) =>
      value === requiredValue ? null : `Must equal '${requiredValue}'`
    );
  }
}
