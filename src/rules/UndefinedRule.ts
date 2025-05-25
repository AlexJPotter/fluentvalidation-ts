import { Rule } from './Rule';

export class UndefinedRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => (value === undefined ? null : 'Value must be undefined'));
  }
}
