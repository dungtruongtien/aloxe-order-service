"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusMapping = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["BOOKED"] = 1] = "BOOKED";
    OrderStatus[OrderStatus["ONBOARDING"] = 2] = "ONBOARDING";
    OrderStatus[OrderStatus["ARRIVED"] = 3] = "ARRIVED";
    OrderStatus[OrderStatus["CANCELLED"] = 4] = "CANCELLED";
    OrderStatus[OrderStatus["PAID"] = 5] = "PAID";
    OrderStatus[OrderStatus["DRIVER_FOUND"] = 6] = "DRIVER_FOUND";
    OrderStatus[OrderStatus["DRIVER_CONFIRMED"] = 7] = "DRIVER_CONFIRMED";
    OrderStatus[OrderStatus["DRIVER_COME"] = 8] = "DRIVER_COME";
    OrderStatus[OrderStatus["DRIVER_NOT_FOUND"] = 9] = "DRIVER_NOT_FOUND";
    OrderStatus[OrderStatus["WAITING_FOR_DRIVER"] = 10] = "WAITING_FOR_DRIVER";
    OrderStatus[OrderStatus["USER_CANCELLED"] = 11] = "USER_CANCELLED";
    OrderStatus[OrderStatus["CONFIRMED"] = 12] = "CONFIRMED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
exports.OrderStatusMapping = {
    1: 'BOOKED',
    2: 'ONBOARDING',
    3: 'ARRIVED',
    4: 'CANCELLED',
    5: 'PAID',
    6: 'DRIVER_FOUND',
    7: 'DRIVER_CONFIRMED',
    8: 'DRIVER_COME',
    9: 'DRIVER_NOT_FOUND',
    10: 'WAITING_FOR_DRIVER',
    11: 'USER_CANCELLED',
    12: 'CONFIRMED'
};
//# sourceMappingURL=order.interface.js.map