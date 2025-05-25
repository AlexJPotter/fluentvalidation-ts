import { ValueValidationResult } from '@/ValueValidationResult';

export const hasError = <TValue>(valueValidationResult: ValueValidationResult<TValue>): boolean => {
  if (valueValidationResult == null) {
    return false;
  }

  if (Array.isArray(valueValidationResult)) {
    return valueValidationResult.filter((eachResult) => hasError(eachResult)).length > 0;
  }

  if (typeof valueValidationResult === 'object') {
    return Object.keys(valueValidationResult as object).length > 0;
  }

  return true;
};
