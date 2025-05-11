import { Rule } from './Rule';

export class NullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => (value == null ? null : 'Value must be null'));
  }
}
