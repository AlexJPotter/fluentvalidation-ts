"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var EmailAddressRule_1 = require("../rules/EmailAddressRule");
var EqualRule_1 = require("../rules/EqualRule");
var ExclusiveBetweenRule_1 = require("../rules/ExclusiveBetweenRule");
var GreaterThanOrEqualToRule_1 = require("../rules/GreaterThanOrEqualToRule");
var GreaterThanRule_1 = require("../rules/GreaterThanRule");
var InclusiveBetweenRule_1 = require("../rules/InclusiveBetweenRule");
var LengthRule_1 = require("../rules/LengthRule");
var LessThanOrEqualToRule_1 = require("../rules/LessThanOrEqualToRule");
var LessThanRule_1 = require("../rules/LessThanRule");
var MatchesRule_1 = require("../rules/MatchesRule");
var MaxLengthRule_1 = require("../rules/MaxLengthRule");
var MinLengthRule_1 = require("../rules/MinLengthRule");
var MustRule_1 = require("../rules/MustRule");
var NotEmptyRule_1 = require("../rules/NotEmptyRule");
var NotEqualRule_1 = require("../rules/NotEqualRule");
var NotNullRule_1 = require("../rules/NotNullRule");
var NullRule_1 = require("../rules/NullRule");
var ScalePrecisionRule_1 = require("../rules/ScalePrecisionRule");
var ValidatorRule_1 = require("../rules/ValidatorRule");
var ValueValidator_1 = require("./ValueValidator");
var ValueValidatorBuilder = /** @class */ (function () {
    function ValueValidatorBuilder(rebuildValidate) {
        var _this = this;
        this.rules = [];
        this.rebuildValidate = function () {
            throw new Error("'rebuildValidate' has not been instantiated");
        };
        this.build = function () {
            return function (value, model) {
                for (var _i = 0, _a = _this.rules; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    var validationResult = rule.validate(value, model);
                    if (ValueValidator_1.hasError(validationResult)) {
                        return validationResult;
                    }
                }
                return null;
            };
        };
        this.pushRule = function (rule) {
            _this.rules.push(rule);
            _this.rebuildValidate();
        };
        this.withMessage = function (message) {
            var latestRule = _this.getLatestRule();
            latestRule.setCustomErrorMessage(message);
            _this.rebuildValidate();
            return __assign({}, _this.getAllRules(), { when: _this.when, unless: _this.unless });
        };
        this.when = function (condition, appliesTo) {
            if (appliesTo === void 0) { appliesTo = 'AppliesToAllValidators'; }
            if (appliesTo === 'AppliesToAllValidators') {
                for (var _i = 0, _a = _this.rules; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    rule.setWhenCondition(condition);
                }
            }
            else {
                var latestRule = _this.getLatestRule();
                latestRule.setWhenCondition(condition);
            }
            _this.rebuildValidate();
            return _this.getAllRules();
        };
        this.unless = function (condition, appliesTo) {
            if (appliesTo === void 0) { appliesTo = 'AppliesToAllValidators'; }
            if (appliesTo === 'AppliesToAllValidators') {
                for (var _i = 0, _a = _this.rules; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    rule.setUnlessCondition(condition);
                }
            }
            else {
                var latestRule = _this.getLatestRule();
                latestRule.setUnlessCondition(condition);
            }
            _this.rebuildValidate();
            return _this.getAllRules();
        };
        this.notEqual = function (forbiddenValue) {
            var notEqualRule = new NotEqualRule_1.NotEqualRule(forbiddenValue);
            _this.pushRule(notEqualRule);
            return _this.getAllRulesAndExtensions();
        };
        this.equal = function (requiredValue) {
            var equalRule = new EqualRule_1.EqualRule(requiredValue);
            _this.pushRule(equalRule);
            return _this.getAllRulesAndExtensions();
        };
        this.must = function (predicate) {
            var mustRule = new MustRule_1.MustRule(predicate);
            _this.pushRule(mustRule);
            return _this.getAllRulesAndExtensions();
        };
        this.notNull = function () {
            var notNullRule = new NotNullRule_1.NotNullRule();
            _this.pushRule(notNullRule);
            return _this.getAllRulesAndExtensions();
        };
        this.null = function () {
            var nullRule = new NullRule_1.NullRule();
            _this.pushRule(nullRule);
            return _this.getAllRulesAndExtensions();
        };
        this.notEmpty = function () {
            var notEmptyRule = new NotEmptyRule_1.NotEmptyRule();
            _this.pushRule(notEmptyRule);
            return _this.getAllRulesAndExtensions();
        };
        this.length = function (minLength, maxLength) {
            var lengthRule = new LengthRule_1.LengthRule(minLength, maxLength);
            _this.pushRule(lengthRule);
            return _this.getAllRulesAndExtensions();
        };
        this.maxLength = function (maxLength) {
            var maxLengthRule = new MaxLengthRule_1.MaxLengthRule(maxLength);
            _this.pushRule(maxLengthRule);
            return _this.getAllRulesAndExtensions();
        };
        this.minLength = function (minLength) {
            var minLengthRule = new MinLengthRule_1.MinLengthRule(minLength);
            _this.pushRule(minLengthRule);
            return _this.getAllRulesAndExtensions();
        };
        this.matches = function (pattern) {
            var matchesRule = new MatchesRule_1.MatchesRule(pattern);
            _this.pushRule(matchesRule);
            return _this.getAllRulesAndExtensions();
        };
        this.emailAddress = function () {
            var emailAddressRule = new EmailAddressRule_1.EmailAddressRule();
            _this.pushRule(emailAddressRule);
            return _this.getAllRulesAndExtensions();
        };
        this.lessThan = function (threshold) {
            var lessThanRule = new LessThanRule_1.LessThanRule(threshold);
            _this.pushRule(lessThanRule);
            return _this.getAllRulesAndExtensions();
        };
        this.lessThanOrEqualTo = function (threshold) {
            var lessThanOrEqualToRule = new LessThanOrEqualToRule_1.LessThanOrEqualToRule(threshold);
            _this.pushRule(lessThanOrEqualToRule);
            return _this.getAllRulesAndExtensions();
        };
        this.greaterThan = function (threshold) {
            var greaterThanRule = new GreaterThanRule_1.GreaterThanRule(threshold);
            _this.pushRule(greaterThanRule);
            return _this.getAllRulesAndExtensions();
        };
        this.greaterThanOrEqualTo = function (threshold) {
            var greaterThanOrEqualToRule = new GreaterThanOrEqualToRule_1.GreaterThanOrEqualToRule(threshold);
            _this.pushRule(greaterThanOrEqualToRule);
            return _this.getAllRulesAndExtensions();
        };
        this.exclusiveBetween = function (lowerBound, upperBound) {
            var exclusiveBetweenRule = new ExclusiveBetweenRule_1.ExclusiveBetweenRule(lowerBound, upperBound);
            _this.pushRule(exclusiveBetweenRule);
            return _this.getAllRulesAndExtensions();
        };
        this.inclusiveBetween = function (lowerBound, upperBound) {
            var inclusiveBetweenRule = new InclusiveBetweenRule_1.InclusiveBetweenRule(lowerBound, upperBound);
            _this.pushRule(inclusiveBetweenRule);
            return _this.getAllRulesAndExtensions();
        };
        this.setValidator = function (validatorProducer) {
            var validatorRule = new ValidatorRule_1.ValidatorRule(validatorProducer);
            _this.pushRule(validatorRule);
            return _this.getAllRulesAndExtensions();
        };
        this.scalePrecision = function (precision, scale) {
            if (scale - precision <= 0) {
                throw new Error('Invalid scale and precision were passed to the scalePrecision rule');
            }
            var scalePrecisionRule = new ScalePrecisionRule_1.ScalePrecisionRule(precision, scale);
            _this.pushRule(scalePrecisionRule);
            return _this.getAllRulesAndExtensions();
        };
        this.getAllRules = function () {
            return {
                notEqual: _this.notEqual,
                equal: _this.equal,
                must: _this.must,
                notNull: _this.notNull,
                null: _this.null,
                notEmpty: _this.notEmpty,
                length: _this.length,
                maxLength: _this.maxLength,
                minLength: _this.minLength,
                matches: _this.matches,
                emailAddress: _this.emailAddress,
                lessThan: _this.lessThan,
                lessThanOrEqualTo: _this.lessThanOrEqualTo,
                greaterThan: _this.greaterThan,
                greaterThanOrEqualTo: _this.greaterThanOrEqualTo,
                exclusiveBetween: _this.exclusiveBetween,
                inclusiveBetween: _this.inclusiveBetween,
                setValidator: _this.setValidator,
                scalePrecision: _this.scalePrecision,
            };
        };
        this.getAllRulesAndExtensions = function () {
            return __assign({}, _this.getAllRules(), { withMessage: _this.withMessage, when: _this.when, unless: _this.unless });
        };
        this.getLatestRule = function () {
            return _this.rules[_this.rules.length - 1];
        };
        this.rebuildValidate = rebuildValidate;
    }
    return ValueValidatorBuilder;
}());
exports.ValueValidatorBuilder = ValueValidatorBuilder;
