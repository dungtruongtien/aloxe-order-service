"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.NotfoundError = exports.BusinessError = exports.ValidationError = exports.CustomError = void 0;
var graphql_1 = require("graphql");
var CustomError = (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message) {
        var _this = _super.call(this, message) || this;
        _this.status = 0;
        _this.name = 'CustomError';
        return _this;
    }
    return CustomError;
}(graphql_1.GraphQLError));
exports.CustomError = CustomError;
var ValidationError = (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ValidationError';
        _this.status = 400;
        return _this;
    }
    return ValidationError;
}(CustomError));
exports.ValidationError = ValidationError;
var BusinessError = (function (_super) {
    __extends(BusinessError, _super);
    function BusinessError(message, options) {
        var _this = _super.call(this, message, options) || this;
        _this.message = message;
        return _this;
    }
    return BusinessError;
}(graphql_1.GraphQLError));
exports.BusinessError = BusinessError;
var NotfoundError = (function (_super) {
    __extends(NotfoundError, _super);
    function NotfoundError(message, name) {
        if (name === void 0) { name = 'NotfoundError'; }
        var _this = _super.call(this, message) || this;
        _this.name = name;
        _this.status = 404;
        return _this;
    }
    return NotfoundError;
}(CustomError));
exports.NotfoundError = NotfoundError;
var AuthenticationError = (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(message, name) {
        if (name === void 0) { name = 'AuthenticationError'; }
        var _this = _super.call(this, message) || this;
        _this.name = name;
        _this.status = 401;
        return _this;
    }
    return AuthenticationError;
}(CustomError));
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=custom_error.js.map