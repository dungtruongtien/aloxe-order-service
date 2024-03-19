"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var account_1 = __importDefault(require("./account"));
var user_1 = __importDefault(require("./user"));
var mergeRawSchemas_1 = require("../helpers/mergeRawSchemas");
exports.default = (0, mergeRawSchemas_1.mergeRawSchemas)({
    typeDefs: [
        (0, apollo_server_express_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        type Query {\n          _empty: String\n        }\n\n        type Mutation {\n          _empty: String\n        }\n\n        type Subscription {\n          _empty: String\n        }\n      "], ["\n        type Query {\n          _empty: String\n        }\n\n        type Mutation {\n          _empty: String\n        }\n\n        type Subscription {\n          _empty: String\n        }\n      "]))),
    ],
    resolvers: {},
}, (0, mergeRawSchemas_1.mergeRawSchemas)(account_1.default, user_1.default));
var templateObject_1;
//# sourceMappingURL=schema.js.map