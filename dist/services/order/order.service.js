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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
var order_interface_1 = require("../../repository/order/order.interface");
var user_interface_1 = require("../../repository/user/user.interface");
var order_interface_2 = require("./order.interface");
var distance_1 = require("../../utils/distance");
var constant_1 = require("../../common/constant");
var driver_repository_1 = require("../../repository/driver/driver.repository");
var custom_error_1 = require("../../common/custom_error");
var OrderService = (function () {
    function OrderService(orderRepo, userRepo, staffRepo, driverRepo, customerRepo, bookingService, notificationService) {
        var _this = this;
        this.getListOrders = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var rs, customerId, limit, offset, userFilter, listUsers, orders, staffIds, staffs, customerIds, customers, driverIds, drivers, ordersRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rs = [];
                        customerId = [];
                        limit = 1000;
                        offset = 0;
                        if (!(filter === null || filter === void 0 ? void 0 : filter.search)) return [3, 2];
                        userFilter = {
                            phoneNumber: [filter.search]
                        };
                        return [4, this.userRepo.getUsers(userFilter)];
                    case 1:
                        listUsers = _a.sent();
                        if (!listUsers) {
                            return [2, rs];
                        }
                        customerId = listUsers.map(function (user) { return user.customer ? user.customer.id : 0; });
                        filter.customerIds = customerId;
                        _a.label = 2;
                    case 2: return [4, this.orderRepo.getListOrder(filter, limit, offset, {})];
                    case 3:
                        orders = _a.sent();
                        if (!orders) {
                            return [2, rs];
                        }
                        staffIds = orders.map(function (order) { var _a; return (_a = order.supportStaffId) !== null && _a !== void 0 ? _a : 0; }).filter(function (staffId) { return staffId !== 0; });
                        return [4, this.staffRepo.getStaffs({ staffIds: staffIds })];
                    case 4:
                        staffs = _a.sent();
                        customerIds = orders.map(function (order) { return order.customerId; });
                        return [4, this.customerRepo.getCustomers({ customerIds: customerIds })];
                    case 5:
                        customers = _a.sent();
                        driverIds = orders.map(function (order) { var _a; return (_a = order.driverId) !== null && _a !== void 0 ? _a : 0; }).filter(function (driverId) { return driverId !== 0; });
                        return [4, this.driverRepo.getDrivers({ driverIds: driverIds })];
                    case 6:
                        drivers = _a.sent();
                        ordersRes = [];
                        orders.forEach(function (order) {
                            var staff = staffs.find(function (staff) { return staff.id === order.supportStaffId; });
                            var driver = drivers.find(function (driver) { return driver.id === order.driverId; });
                            var customer = customers.find(function (customer) { return customer.id === order.customerId; });
                            var status = user_interface_1.OrderStatusMapping[order.status];
                            var orderRes = __assign(__assign({}, order), { staff: staff, driver: driver, customer: customer, status: status });
                            ordersRes.push(orderRes);
                        });
                        return [2, ordersRes];
                }
            });
        }); };
        this.getOrder = function (id) { return __awaiter(_this, void 0, void 0, function () {
            var order, orderRes, staffs, customers, drivers;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4, this.orderRepo.getOrder(id)];
                    case 1:
                        order = _d.sent();
                        if (!order) {
                            return [2, null];
                        }
                        orderRes = __assign({}, order);
                        if (!order.supportStaffId) return [3, 3];
                        return [4, this.staffRepo.getStaffs({ staffIds: [order.supportStaffId] })];
                    case 2:
                        staffs = _d.sent();
                        orderRes.staff = (_a = staffs[0]) !== null && _a !== void 0 ? _a : {};
                        _d.label = 3;
                    case 3: return [4, this.customerRepo.getCustomers({ customerIds: [order.customerId] })];
                    case 4:
                        customers = _d.sent();
                        orderRes.customer = (_b = customers[0]) !== null && _b !== void 0 ? _b : {};
                        if (!order.driverId) return [3, 6];
                        return [4, this.driverRepo.getDrivers({ driverIds: [order.driverId] })];
                    case 5:
                        drivers = _d.sent();
                        orderRes.driver = (_c = drivers[0]) !== null && _c !== void 0 ? _c : {};
                        _d.label = 6;
                    case 6: return [2, orderRes];
                }
            });
        }); };
        this.createOrder = function (input) { return __awaiter(_this, void 0, void 0, function () {
            var customer, user, userInfo, resp, orderDetail, pickPosition, returnPosition, distance, totalPrice, orderCreateDto, orderCreatedRes, processBookingOrderDTO;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        customer = input.customer;
                        if (customer && !customer.phoneNumber) {
                            throw new custom_error_1.BadRequestError('Customer phone number is required');
                        }
                        user = null;
                        if (!((customer === null || customer === void 0 ? void 0 : customer.phoneNumber) || (input === null || input === void 0 ? void 0 : input.customerId))) return [3, 2];
                        return [4, this.getUserInfo(input.customer, input.customerId)];
                    case 1:
                        userInfo = _g.sent();
                        user = userInfo;
                        _g.label = 2;
                    case 2:
                        resp = { driver: null, price: 0, user: user, totalPrice: 0 };
                        orderDetail = input.orderDetail;
                        pickPosition = {
                            lat: orderDetail.pickupLatitude,
                            long: orderDetail.pickupLongitude
                        };
                        returnPosition = {
                            lat: orderDetail.returnLatitude,
                            long: orderDetail.returnLongitude
                        };
                        distance = (0, distance_1.getDistanceFromLatLonInKm)(pickPosition, returnPosition);
                        totalPrice = distance * constant_1.PRICE_PER_KM;
                        resp.totalPrice = totalPrice;
                        orderCreateDto = {
                            customerId: (_b = (_a = user === null || user === void 0 ? void 0 : user.customer) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0,
                            supportStaffId: ((_c = input === null || input === void 0 ? void 0 : input.staff) === null || _c === void 0 ? void 0 : _c.id) || 0,
                            code: "BOOK_".concat(new Date().getTime()),
                            status: 1,
                            startTime: new Date(input.startTime),
                            endTime: input.endTime,
                            totalPrice: totalPrice,
                            orderDetail: {
                                create: {
                                    vehicleType: order_interface_2.VEHICLE_TYPE_MAPPING[input.orderDetail.vehicleType],
                                    pickupLongitude: input.orderDetail.pickupLongitude,
                                    pickupLatitude: input.orderDetail.pickupLatitude,
                                    returnLongitude: input.orderDetail.returnLongitude,
                                    returnLatitude: input.orderDetail.returnLatitude,
                                    voucherCode: input.orderDetail.voucherCode,
                                    pickupLocation: input.orderDetail.pickupLocation,
                                    returnLocation: input.orderDetail.returnLocation,
                                    description: ''
                                }
                            }
                        };
                        return [4, this.orderRepo.createOrder(orderCreateDto)];
                    case 3:
                        orderCreatedRes = _g.sent();
                        processBookingOrderDTO = {
                            id: orderCreatedRes.id,
                            customerId: (_e = (_d = user === null || user === void 0 ? void 0 : user.customer) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : 0,
                            supportStaffId: ((_f = input === null || input === void 0 ? void 0 : input.staff) === null || _f === void 0 ? void 0 : _f.id) || 0,
                            code: "BOOK_".concat(new Date().getTime()),
                            status: 1,
                            startTime: input.startTime,
                            endTime: input.endTime,
                            totalPrice: totalPrice,
                            orderDetail: {
                                vehicleType: order_interface_2.VEHICLE_TYPE_MAPPING[input.orderDetail.vehicleType],
                                pickupLongitude: input.orderDetail.pickupLongitude,
                                pickupLatitude: input.orderDetail.pickupLatitude,
                                returnLongitude: input.orderDetail.returnLongitude,
                                returnLatitude: input.orderDetail.returnLatitude,
                                voucherCode: input.orderDetail.voucherCode,
                                pickupLocation: input.orderDetail.pickupLocation,
                                returnLocation: input.orderDetail.returnLocation,
                                description: ''
                            }
                        };
                        return [4, this.bookingService.processBookingOrder(processBookingOrderDTO)];
                    case 4:
                        _g.sent();
                        return [4, Promise.resolve({
                                orderId: orderCreatedRes.id
                            })];
                    case 5: return [2, _g.sent()];
                }
            });
        }); };
        this.getUserInfo = function (customer, customerId) { return __awaiter(_this, void 0, void 0, function () {
            var user, userFilter, users, input, userCreatedResp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userFilter = {};
                        if (customer === null || customer === void 0 ? void 0 : customer.phoneNumber) {
                            userFilter = {
                                phoneNumber: [customer.phoneNumber]
                            };
                        }
                        if (customerId !== 0) {
                            userFilter = {
                                customerIds: [customerId]
                            };
                        }
                        return [4, this.userRepo.getUsers(userFilter)];
                    case 1:
                        users = _a.sent();
                        if (!(!users || users.length === 0)) return [3, 3];
                        input = {
                            fullName: customer.fullName,
                            phoneNumber: customer.phoneNumber,
                            email: customer.email,
                            customer: {
                                level: 'NORMAL',
                                customerNo: 'CUS_01'
                            }
                        };
                        return [4, this.userRepo.createCustomerUser(input)];
                    case 2:
                        userCreatedResp = _a.sent();
                        if (!userCreatedResp) {
                            throw new Error('Cannot create account');
                        }
                        return [2, userCreatedResp];
                    case 3:
                        user = users[0];
                        _a.label = 4;
                    case 4: return [2, user];
                }
            });
        }); };
        this.updateOrder = function (input) { return __awaiter(_this, void 0, void 0, function () {
            var orderUpdateDto, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderUpdateDto = {
                            status: input.status,
                            driverId: input.driverId,
                            totalPrice: input.totalPrice
                        };
                        return [4, this.orderRepo.updateOrder(input.id, orderUpdateDto)];
                    case 1:
                        data = _a.sent();
                        return [2, data];
                }
            });
        }); };
        this.orderDriverAction = function (orderId, actionType, assignedDriverId) { return __awaiter(_this, void 0, void 0, function () {
            var order, bookingResp, _a, input, input, input;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.orderRepo.getOrder(orderId)];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            throw new Error('Order is not exist');
                        }
                        bookingResp = null;
                        _a = actionType;
                        switch (_a) {
                            case 'CONFIRMED': return [3, 2];
                            case 'CANCELLED': return [3, 4];
                            case 'USER_CANCELLED': return [3, 7];
                            case 'ARRIVED': return [3, 12];
                            case 'PAID': return [3, 14];
                            case 'ONBOARDING': return [3, 18];
                            case 'DRIVER_COME': return [3, 20];
                        }
                        return [3, 22];
                    case 2: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.DRIVER_CONFIRMED })];
                    case 3:
                        bookingResp = _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_CONFIRMED' }) });
                        return [2, bookingResp];
                    case 4: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.CANCELLED })];
                    case 5:
                        bookingResp = _b.sent();
                        input = {
                            driverId: assignedDriverId,
                            workingStatus: driver_repository_1.DriverOnlineSessionWorkingStatusEnum.WAITING_FOR_CUSTOMER
                        };
                        return [4, this.driverRepo.updateDriverOnlineSession(input)];
                    case 6:
                        _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'CANCELLED', message: 'Driver is cancelled your booking, please retry to book a new car.' }) });
                        return [2, bookingResp];
                    case 7: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.CANCELLED })];
                    case 8:
                        bookingResp = _b.sent();
                        if (!assignedDriverId) return [3, 11];
                        input = {
                            driverId: assignedDriverId,
                            workingStatus: driver_repository_1.DriverOnlineSessionWorkingStatusEnum.WAITING_FOR_CUSTOMER
                        };
                        return [4, this.driverRepo.updateDriverOnlineSession(input)];
                    case 9:
                        _b.sent();
                        return [4, this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'USER_CANCELLED', message: 'Customer cancelled your booking.' }) })];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11: return [2, bookingResp];
                    case 12: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.ARRIVED })];
                    case 13:
                        bookingResp = _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ARRIVED' }) });
                        return [2, bookingResp];
                    case 14: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.PAID })];
                    case 15:
                        bookingResp = _b.sent();
                        if (!assignedDriverId) return [3, 17];
                        input = {
                            driverId: assignedDriverId,
                            workingStatus: driver_repository_1.DriverOnlineSessionWorkingStatusEnum.DRIVING
                        };
                        return [4, this.driverRepo.updateDriverOnlineSession(input)];
                    case 16:
                        _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'PAID' }) });
                        _b.label = 17;
                    case 17: return [2, bookingResp];
                    case 18: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.ONBOARDING })];
                    case 19:
                        bookingResp = _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'ONBOARDING' }) });
                        return [2, bookingResp];
                    case 20: return [4, this.orderRepo.updateOrder(orderId, { status: order_interface_1.OrderStatus.DRIVER_COME })];
                    case 21:
                        bookingResp = _b.sent();
                        this.notificationService.broadcast({ msgId: orderId.toString(), content: JSON.stringify({ status: 'DRIVER_COME' }) });
                        return [2, bookingResp];
                    case 22: return [3, 23];
                    case 23: return [2, null];
                }
            });
        }); };
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.staffRepo = staffRepo;
        this.driverRepo = driverRepo;
        this.customerRepo = customerRepo;
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }
    return OrderService;
}());
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map