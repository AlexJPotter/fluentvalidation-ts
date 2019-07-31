"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rule_1 = require("./Rule");
var ExclusiveBetweenRule = /** @class */ (function (_super) {
    __extends(ExclusiveBetweenRule, _super);
    function ExclusiveBetweenRule(lowerBound, upperBound) {
        return _super.call(this, function (value) {
            if (value == null) {
                return null;
            }
            if (typeof value !== 'number') {
                throw new TypeError('A non-number value was passed to the exclusiveBetween rule');
            }
            return value > lowerBound && value < upperBound
                ? null
                : "Value must be between " + lowerBound.toLocaleString() + " and " + upperBound.toLocaleString() + " (exclusive)";
        }) || this;
    }
    return ExclusiveBetweenRule;
}(Rule_1.Rule));
exports.ExclusiveBetweenRule = ExclusiveBetweenRule;
