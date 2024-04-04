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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restAuthenticate = exports.graphqlAuthenticate = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var constant_1 = require("../common/constant");
var WHITE_LIST_APIS = ['/api/user/v1/register', '/api/auth/v1/login', '/api/auth/v1/token/access', '/api/auth/v1/logout'];
var WHITE_LIST_GRAPHQL_OPERATIONS = ['Login'];
var GRAPHQL_PATH = '/graphql';
var graphqlAuthenticate = function (req, res, next) {
    var _a;
    var operationName = req.body.operationName;
    if (!operationName) {
        throw new Error('Authentication failed');
    }
    if (WHITE_LIST_GRAPHQL_OPERATIONS.includes(operationName)) {
        next();
        return;
    }
    var token = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    console.log('req----', req);
    if (!token) {
        throw new Error('Authentication failed');
    }
    jsonwebtoken_1.default.verify(token, constant_1.AUTH_ACCESS_SERCRET_KEY, function (err, decoded) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                throw new Error('TokenExpiredError');
            }
            throw new Error('TokenExpiredError');
        }
        res.locals.user = __assign({}, decoded);
        next();
    });
};
exports.graphqlAuthenticate = graphqlAuthenticate;
var restAuthenticate = function (req, res, next) {
    var _a;
    if (WHITE_LIST_APIS.includes(req.originalUrl) || req.originalUrl === GRAPHQL_PATH) {
        next();
        return;
    }
    var token = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    if (!token) {
        throw new Error('Authentication failed');
    }
    jsonwebtoken_1.default.verify(token, constant_1.AUTH_ACCESS_SERCRET_KEY, function (err, decoded) {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                throw new Error('TokenExpiredError');
            }
            throw new Error('TokenExpiredError');
        }
        res.locals.user = __assign({}, decoded);
        next();
    });
};
exports.restAuthenticate = restAuthenticate;
//# sourceMappingURL=auth.middleware.js.map