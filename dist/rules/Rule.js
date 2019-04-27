"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rule = /** @class */ (function () {
    function Rule(valueValidator) {
        var _this = this;
        this.setCustomErrorMessage = function (customErrorMessage) {
            _this.customErrorMessage = customErrorMessage;
        };
        this.setWhenCondition = function (condition) {
            _this.whenCondition = condition;
        };
        this.setUnlessCondition = function (condition) {
            _this.unlessCondition = condition;
        };
        this.validate = function (value, model) {
            if (_this.whenCondition != null && !_this.whenCondition(model)) {
                return null;
            }
            if (_this.unlessCondition != null && _this.unlessCondition(model)) {
                return null;
            }
            var errorOrNull = _this.valueValidator(value, model);
            return errorOrNull != null ? _this.customErrorMessage || errorOrNull : null;
        };
        this.valueValidator = valueValidator;
    }
    return Rule;
}());
exports.Rule = Rule;
