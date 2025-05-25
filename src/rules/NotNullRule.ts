import { Rule } from './Rule';

export class NotNullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => (value != null ? null : 'Value cannot be null'));
  }
}
