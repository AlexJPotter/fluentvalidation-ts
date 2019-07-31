import { Rule } from './Rule';
export declare class NotEqualRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(forbiddenValue: TValue);
}
