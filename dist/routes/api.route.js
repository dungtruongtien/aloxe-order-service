"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootRoute = void 0;
var express_1 = __importDefault(require("express"));
var order_route_1 = require("./order.route");
var createRootRoute = function () {
    var router = express_1.default.Router();
    var orderRoute = (0, order_route_1.createOrderRoute)();
    router.use('/orders', orderRoute);
    return router;
};
exports.createRootRoute = createRootRoute;
//# sourceMappingURL=api.route.js.map