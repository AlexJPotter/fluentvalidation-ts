import { Rule } from './Rule';
export declare class InclusiveBetweenRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(lowerBound: number, upperBound: number);
}
