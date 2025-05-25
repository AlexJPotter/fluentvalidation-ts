import { Rule } from './Rule';

export class NotEqualRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(forbiddenValue: TValue) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) =>
      value !== forbiddenValue ? null : `Must not equal '${forbiddenValue}'`,
    );
  }
}
