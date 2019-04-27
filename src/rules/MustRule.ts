import { Rule } from './Rule';

export class MustRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<
  TModel,
  TValue
> {
  constructor(predicate: (value: TValue, model: TModel) => boolean) {
    super((value: TValue, model: TModel) => (predicate(value, model) ? null : 'Value is not valid'));
  }
}
