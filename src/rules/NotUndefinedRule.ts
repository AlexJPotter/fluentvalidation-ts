import { Rule } from './Rule';

export class NotUndefinedRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => (value === undefined ? 'Value cannot be undefined' : null));
  }
}
