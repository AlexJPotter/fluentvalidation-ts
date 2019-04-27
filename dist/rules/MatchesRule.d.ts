import { Rule } from './Rule';
export declare class MatchesRule<TModel, TValue extends TModel[keyof TModel]> extends Rule<TModel, TValue> {
    constructor(pattern: RegExp);
}
