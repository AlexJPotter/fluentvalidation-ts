import { Rule } from './Rule';
export declare class MustRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(predicate: (value: TValue, model: TModel) => boolean);
}
