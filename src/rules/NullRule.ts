import { Rule } from './Rule';

export type NullRuleOptions = {
  includeUndefined: boolean;
};

export class NullRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor({ includeUndefined }: NullRuleOptions) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (includeUndefined) {
        return value == null ? null : 'Value must be null';
      }

      return value === null ? null : 'Value must be null';
    });
  }
}
