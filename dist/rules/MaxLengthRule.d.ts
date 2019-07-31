import { Rule } from './Rule';
export declare class MaxLengthRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(maxLength: number);
}
