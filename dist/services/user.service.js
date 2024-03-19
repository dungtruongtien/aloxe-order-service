"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var UserService = (function () {
    function UserService(userRepo) {
        this.userRepo = userRepo;
    }
    UserService.prototype.getUser = function () {
        console.log('service, here');
        var test = this.userRepo.getUsers();
        return test;
    };
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map