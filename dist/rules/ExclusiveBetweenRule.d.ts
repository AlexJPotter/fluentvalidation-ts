import { Rule } from './Rule';
export declare class ExclusiveBetweenRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(lowerBound: number, upperBound: number);
}
