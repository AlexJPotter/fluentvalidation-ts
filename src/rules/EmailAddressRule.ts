import { Rule } from './Rule';

const emailAddressPattern = /^[a-zA-Z0-9.!#$%&’"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export class EmailAddressRule<TModel, TValue> extends Rule<TModel, TValue> {
  constructor() {
    super((value: TValue) => {
      if (value == null) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new TypeError(
          'A non-string value was passed to the emailAddress rule'
        );
      }
      return emailAddressPattern.test(value)
        ? null
        : 'Not a valid email address';
    });
  }
}
