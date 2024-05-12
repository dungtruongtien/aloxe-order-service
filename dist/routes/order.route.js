"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderRoute = void 0;
var express_1 = __importDefault(require("express"));
var order_controller_rest_1 = __importDefault(require("../controller/order/order.controller.rest"));
var createOrderRoute = function () {
    var router = express_1.default.Router();
    var orderController = new order_controller_rest_1.default();
    router.get('/', orderController.getListOrders.bind(orderController));
    router.put('/', orderController.updateOrder.bind(orderController));
    router.post('/', orderController.createOrder.bind(orderController));
    router.put('/order-action', orderController.orderDriverAction.bind(orderController));
    return router;
};
exports.createOrderRoute = createOrderRoute;
//# sourceMappingURL=order.route.js.map