"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var customer_repository_1 = require("../../repository/customer/customer.repository");
var driver_repository_1 = require("../../repository/driver/driver.repository");
var order_repository_1 = require("../../repository/order/order.repository");
var staff_repository_1 = require("../../repository/staff/staff.repository");
var user_repository_1 = require("../../repository/user/user.repository");
var order_service_1 = require("../../services/order/order.service");
var axios_1 = require("axios");
var booking_service_1 = require("../../services/booking/booking.service");
var notification_service_1 = __importDefault(require("../../services/notification/notification.service"));
var OrderRestController = (function () {
    function OrderRestController() {
        var _this = this;
        this.orderRepository = new order_repository_1.OrderRepository();
        this.userRepository = new user_repository_1.UserRepository();
        this.customerRepository = new customer_repository_1.CustomerRepository();
        this.driverRepository = new driver_repository_1.DriverRepository();
        this.staffRepository = new staff_repository_1.StaffRepository();
        this.bookingService = new booking_service_1.BookingService();
        this.notificationService = new notification_service_1.default();
        this.orderDriverAction = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var driverId, _a, orderId, actionType, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        driverId = res.locals.session.driver.id;
                        _a = req.body, orderId = _a.orderId, actionType = _a.actionType;
                        return [4, this.orderService.orderDriverAction(orderId, actionType, driverId)];
                    case 1:
                        data = _b.sent();
                        res.status(axios_1.HttpStatusCode.Ok).json({
                            status: 'SUCCESS',
                            data: data
                        });
                        return [3, 3];
                    case 2:
                        error_1 = _b.sent();
                        next(error_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); };
        this.orderService = new order_service_1.OrderService(this.orderRepository, this.userRepository, this.staffRepository, this.driverRepository, this.customerRepository, this.bookingService, this.notificationService);
    }
    OrderRestController.prototype.getListOrders = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var filter, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = req.query.filter;
                        return [4, this.orderService.getListOrders(filter)];
                    case 1:
                        data = _a.sent();
                        res.status(axios_1.HttpStatusCode.Ok).json({
                            status: 'SUCCESS',
                            data: data
                        });
                        return [2];
                }
            });
        });
    };
    OrderRestController.prototype.getOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4, this.orderService.getOrder(parseInt(id))];
                    case 1:
                        data = _a.sent();
                        res.status(axios_1.HttpStatusCode.Ok).json({
                            status: 'SUCCESS',
                            data: data
                        });
                        return [3, 3];
                    case 2:
                        error_2 = _a.sent();
                        next(error_2);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    OrderRestController.prototype.updateOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.orderService.updateOrder(req.body)];
                    case 1:
                        data = _a.sent();
                        res.status(axios_1.HttpStatusCode.Ok).json({
                            status: 'SUCCESS',
                            data: data
                        });
                        return [2];
                }
            });
        });
    };
    OrderRestController.prototype.createOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.orderService.createOrder(req.body)];
                    case 1:
                        data = _a.sent();
                        res.status(axios_1.HttpStatusCode.Ok).json({
                            status: 'SUCCESS',
                            data: data
                        });
                        return [2];
                }
            });
        });
    };
    return OrderRestController;
}());
exports.default = OrderRestController;
//# sourceMappingURL=order.controller.rest.js.map