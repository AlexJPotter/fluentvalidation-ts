import { Rule } from './Rule';
export declare class NullRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor();
}
