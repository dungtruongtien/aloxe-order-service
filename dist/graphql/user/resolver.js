"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Query: {
        me: function () {
            return { id: "1", username: "@ava" };
        },
        users: function () {
            return users;
        },
    },
};
var users = [
    {
        id: 1,
        username: "Author 1",
    },
    {
        id: 2,
        username: "Author 2",
    },
];
//# sourceMappingURL=resolver.js.map