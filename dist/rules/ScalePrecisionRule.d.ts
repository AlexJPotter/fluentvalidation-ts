import { Rule } from './Rule';
export declare class ScalePrecisionRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(precision: number, scale: number);
}
