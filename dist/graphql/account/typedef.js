"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.default = (0, apollo_server_express_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  extend type Query {\n    accounts: [Account]\n    account: Account\n  }\n\n  type Account @key(fields: \"id\") {\n    id: ID!\n    token: String\n  }\n"], ["\n  extend type Query {\n    accounts: [Account]\n    account: Account\n  }\n\n  type Account @key(fields: \"id\") {\n    id: ID!\n    token: String\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=typedef.js.map