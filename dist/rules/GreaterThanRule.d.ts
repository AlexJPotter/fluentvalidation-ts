import { Rule } from './Rule';
export declare class GreaterThanRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(threshold: number);
}
