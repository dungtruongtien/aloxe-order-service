"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRawSchemas = void 0;
var lodash_1 = require("lodash");
function withArraysConcatination(objValue, srcValue) {
    if ((0, lodash_1.isArray)(objValue)) {
        return objValue.concat(srcValue);
    }
}
var mergeRawSchemas = function () {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    return lodash_1.mergeWith.apply(void 0, __spreadArray(__spreadArray([{}], schemas, false), [withArraysConcatination], false));
};
exports.mergeRawSchemas = mergeRawSchemas;
//# sourceMappingURL=mergeRawSchemas.js.map