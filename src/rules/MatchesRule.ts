import { Rule } from './Rule';

export class MatchesRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor(pattern: RegExp) {
    // istanbul ignore next - https://github.com/gotwarlost/istanbul/issues/690
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError('A non-string value was passed to the matches rule');
      }
      return pattern.test(value) ? null : 'Value does not match the required pattern';
    });
  }
}
