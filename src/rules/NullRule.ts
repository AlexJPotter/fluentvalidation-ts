import { Rule } from './Rule';

export class NullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    super((value: TValue) => (value == null ? null : 'Value must be null'));
  }
}
