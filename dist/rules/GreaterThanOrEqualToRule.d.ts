import { Rule } from './Rule';
export declare class GreaterThanOrEqualToRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(threshold: number);
}
