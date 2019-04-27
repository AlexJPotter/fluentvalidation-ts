import { Rule } from './Rule';
export declare class LessThanOrEqualToRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(threshold: number);
}
