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
var emailAddressPattern = /^[a-zA-Z0-9.!#$%&’"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
var EmailAddressRule = /** @class */ (function (_super) {
    __extends(EmailAddressRule, _super);
    function EmailAddressRule() {
        return _super.call(this, function (value) {
            if (value == null) {
                return null;
            }
            if (typeof value !== 'string') {
                throw new TypeError('A non-string value was passed to the emailAddress rule');
            }
            return emailAddressPattern.test(value)
                ? null
                : 'Not a valid email address';
        }) || this;
    }
    return EmailAddressRule;
}(Rule_1.Rule));
exports.EmailAddressRule = EmailAddressRule;
