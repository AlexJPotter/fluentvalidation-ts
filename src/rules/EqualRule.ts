import { Rule } from './Rule';

export class EqualRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(requiredValue: TValue) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => (value === requiredValue ? null : `Must equal '${requiredValue}'`));
  }
}
