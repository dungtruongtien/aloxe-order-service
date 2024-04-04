"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customer_repository_1 = require("./customer/customer.repository");
var driver_repository_1 = require("./driver/driver.repository");
var order_repository_1 = require("./order/order.repository");
var staff_repository_1 = require("./staff/staff.repository");
var user_repository_1 = require("./user/user.repository");
var repos = {
    CustomerRepository: customer_repository_1.CustomerRepository,
    DriverRepository: driver_repository_1.DriverRepository,
    StaffRepository: staff_repository_1.StaffRepository,
    OrderRepository: order_repository_1.OrderRepository,
    UserRepository: user_repository_1.UserRepository
};
exports.default = repos;
//# sourceMappingURL=interface.js.map