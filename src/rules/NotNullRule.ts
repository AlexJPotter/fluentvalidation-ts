import { Rule } from './Rule';

export class NotNullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    super((value: TValue) => (value != null ? null : 'Value cannot be null'));
  }
}
