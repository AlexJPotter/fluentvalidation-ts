"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueValidator_1 = require("./ValueValidator");
var ValueValidatorBuilder_1 = require("./ValueValidatorBuilder");
var ArrayValueValidatorBuilder = /** @class */ (function () {
    function ArrayValueValidatorBuilder(rebuildValidate) {
        var _this = this;
        this.build = function () {
            return function (value, model) {
                if (value == null) {
                    return null;
                }
                var valueValidator = _this.eachValueValidatorBuilder.build();
                var errors = {};
                for (var index = 0; index < value.length; index++) {
                    var errorOrNull = valueValidator(value[index], value);
                    if (ValueValidator_1.hasError(errorOrNull)) {
                        errors[index] = errorOrNull;
                    }
                }
                return ValueValidator_1.hasError(errors) ? errors : null;
            };
        };
        this.getAllRules = function () { return _this.eachValueValidatorBuilder.getAllRules(); };
        this.eachValueValidatorBuilder = new ValueValidatorBuilder_1.ValueValidatorBuilder(rebuildValidate);
    }
    return ArrayValueValidatorBuilder;
}());
exports.ArrayValueValidatorBuilder = ArrayValueValidatorBuilder;
