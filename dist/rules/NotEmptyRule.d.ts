import { Rule } from './Rule';
export declare class NotEmptyRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor();
}
