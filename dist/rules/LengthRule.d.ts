import { Rule } from './Rule';
export declare class LengthRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(minLength: number, maxLength: number);
}
