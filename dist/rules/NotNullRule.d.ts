import { Rule } from './Rule';
export declare class NotNullRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor();
}
