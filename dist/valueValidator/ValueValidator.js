"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasError = function (valueValidationResult) {
    if (valueValidationResult == null) {
        return false;
    }
    if (typeof valueValidationResult === 'object') {
        return Object.keys(valueValidationResult).length > 0;
    }
    return valueValidationResult != null;
};
