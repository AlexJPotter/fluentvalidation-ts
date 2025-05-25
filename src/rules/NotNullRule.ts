import { Rule } from './Rule';

export type NotNullRuleOptions = {
  includeUndefined?: boolean;
};

export class NotNullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor({ includeUndefined }: NotNullRuleOptions) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (includeUndefined) {
        return value == null ? 'Value cannot be null' : null;
      }

      return value === null ? 'Value cannot be null' : null;
    });
  }
}
