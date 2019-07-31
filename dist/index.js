"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayValueValidatorBuilder_1 = require("./valueValidator/ArrayValueValidatorBuilder");
var ValueValidator_1 = require("./valueValidator/ValueValidator");
var ValueValidatorBuilder_1 = require("./valueValidator/ValueValidatorBuilder");
var Validator = /** @class */ (function () {
    function Validator() {
        var _this = this;
        this.valueValidatorBuildersByPropertyName = {};
        this._validate = function (value) {
            return {};
        };
        this.rebuildValidate = function () {
            _this._validate = function (value) {
                var errors = {};
                for (var _i = 0, _a = Object.keys(_this.valueValidatorBuildersByPropertyName); _i < _a.length; _i++) {
                    var propertyName = _a[_i];
                    var valueValidatorBuilders = _this
                        .valueValidatorBuildersByPropertyName[propertyName];
                    for (var _b = 0, _c = valueValidatorBuilders; _b < _c.length; _b++) {
                        var valueValidatorBuilder = _c[_b];
                        var valueValidator = valueValidatorBuilder.build();
                        var result = valueValidator(value[propertyName], value);
                        if (ValueValidator_1.hasError(result)) {
                            errors[propertyName] = result;
                        }
                    }
                }
                return errors;
            };
        };
        this.validate = function (value) {
            return _this._validate(value);
        };
        this.ruleFor = function (propertyName) {
            var valueValidatorBuilder = new ValueValidatorBuilder_1.ValueValidatorBuilder(_this.rebuildValidate);
            _this.valueValidatorBuildersByPropertyName[propertyName] =
                _this.valueValidatorBuildersByPropertyName[propertyName] || [];
            _this.valueValidatorBuildersByPropertyName[propertyName].push(valueValidatorBuilder);
            return valueValidatorBuilder.getAllRules();
        };
        this.ruleForEach = function (propertyName) {
            var arrayValueValidatorBuilder = new ArrayValueValidatorBuilder_1.ArrayValueValidatorBuilder(_this.rebuildValidate);
            if (_this.valueValidatorBuildersByPropertyName[propertyName] == null) {
                _this.valueValidatorBuildersByPropertyName[propertyName] = [];
            }
            _this.valueValidatorBuildersByPropertyName[propertyName].push(arrayValueValidatorBuilder);
            return arrayValueValidatorBuilder.getAllRules();
        };
    }
    return Validator;
}());
exports.Validator = Validator;
