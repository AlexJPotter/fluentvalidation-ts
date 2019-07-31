import { Rule } from './Rule';
export declare class EqualRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(requiredValue: TValue);
}
