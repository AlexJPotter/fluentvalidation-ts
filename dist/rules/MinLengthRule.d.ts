import { Rule } from './Rule';
export declare class MinLengthRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(minLength: number);
}
