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
        this.notEqual = function (forbiddenValue) {
            return _this.eachValueValidatorBuilder.notEqual(forbiddenValue);
        };
        this.equal = function (requiredValue) {
            return _this.eachValueValidatorBuilder.equal(requiredValue);
        };
        this.must = function (predicate) {
            return _this.eachValueValidatorBuilder.must(predicate);
        };
        this.notNull = function () {
            return _this.eachValueValidatorBuilder.notNull();
        };
        this.null = function () {
            return _this.eachValueValidatorBuilder.null();
        };
        this.notEmpty = function () {
            return _this.eachValueValidatorBuilder.notEmpty();
        };
        this.length = function (minLength, maxLength) {
            return _this.eachValueValidatorBuilder.length(minLength, maxLength);
        };
        this.maxLength = function (maxLength) {
            return _this.eachValueValidatorBuilder.maxLength(maxLength);
        };
        this.minLength = function (minLength) {
            return _this.eachValueValidatorBuilder.minLength(minLength);
        };
        this.matches = function (pattern) {
            return _this.eachValueValidatorBuilder.matches(pattern);
        };
        this.emailAddress = function () {
            return _this.eachValueValidatorBuilder.emailAddress();
        };
        this.lessThan = function (threshold) {
            return _this.eachValueValidatorBuilder.lessThan(threshold);
        };
        this.lessThanOrEqualTo = function (threshold) {
            return _this.eachValueValidatorBuilder.lessThanOrEqualTo(threshold);
        };
        this.greaterThan = function (threshold) {
            return _this.eachValueValidatorBuilder.greaterThan(threshold);
        };
        this.greaterThanOrEqualTo = function (threshold) {
            return _this.eachValueValidatorBuilder.greaterThanOrEqualTo(threshold);
        };
        this.exclusiveBetween = function (lowerBound, upperBound) {
            return _this.eachValueValidatorBuilder.exclusiveBetween(lowerBound, upperBound);
        };
        this.inclusiveBetween = function (lowerBound, upperBound) {
            return _this.eachValueValidatorBuilder.inclusiveBetween(lowerBound, upperBound);
        };
        this.getAllRules = function () { return _this.eachValueValidatorBuilder.getAllRules(); };
        this.eachValueValidatorBuilder = new ValueValidatorBuilder_1.ValueValidatorBuilder(rebuildValidate);
    }
    return ArrayValueValidatorBuilder;
}());
exports.ArrayValueValidatorBuilder = ArrayValueValidatorBuilder;
