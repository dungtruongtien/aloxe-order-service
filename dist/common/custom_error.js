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
exports.BadRequestError = exports.AuthenticationError = exports.NotfoundError = exports.ValidationError = exports.CustomError = void 0;
var CustomError = (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message) {
        var _this = _super.call(this, message) || this;
        _this.status = 0;
        _this.code = '';
        _this.name = 'CustomError';
        _this.code = '000000';
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
var ValidationError = (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, code) {
        if (code === void 0) { code = 'ValidationError'; }
        var _this = _super.call(this, message) || this;
        _this.code = 'ValidationError';
        _this.status = 400;
        return _this;
    }
    return ValidationError;
}(CustomError));
exports.ValidationError = ValidationError;
var NotfoundError = (function (_super) {
    __extends(NotfoundError, _super);
    function NotfoundError(message, code) {
        if (code === void 0) { code = 'NotfoundError'; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.status = 404;
        return _this;
    }
    return NotfoundError;
}(CustomError));
exports.NotfoundError = NotfoundError;
var AuthenticationError = (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(message, code) {
        if (code === void 0) { code = 'AuthenticationError'; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.status = 401;
        return _this;
    }
    return AuthenticationError;
}(CustomError));
exports.AuthenticationError = AuthenticationError;
var BadRequestError = (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message, code) {
        if (code === void 0) { code = 'BadRequestError'; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.status = 400;
        return _this;
    }
    return BadRequestError;
}(CustomError));
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=custom_error.js.map