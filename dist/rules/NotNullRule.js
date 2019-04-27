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
var NotNullRule = /** @class */ (function (_super) {
    __extends(NotNullRule, _super);
    function NotNullRule() {
        return _super.call(this, function (value) { return (value != null ? null : 'Value cannot be null'); }) || this;
    }
    return NotNullRule;
}(Rule_1.Rule));
exports.NotNullRule = NotNullRule;
