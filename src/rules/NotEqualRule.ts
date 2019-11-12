import { Rule } from './Rule';

export class NotEqualRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(forbiddenValue: TValue) {
    super((value: TValue) =>
      value !== forbiddenValue ? null : `Must not equal '${forbiddenValue}'`
    );
  }
}
