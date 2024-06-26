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
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var server_1 = require("@apollo/server");
var express4_1 = require("@apollo/server/express4");
var subgraph_1 = require("@apollo/subgraph");
var drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
var cors_1 = __importDefault(require("cors"));
var schema_1 = __importDefault(require("./graphql/schema/schema"));
var context_1 = __importDefault(require("./graphql/context"));
var api_route_1 = require("./routes/api.route");
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var app, httpServer, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    httpServer = http_1.default.createServer(app);
                    server = new server_1.ApolloServer({
                        schema: (0, subgraph_1.buildSubgraphSchema)(schema_1.default),
                        plugins: [
                            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer: httpServer })
                        ],
                        formatError: function (formattedError, error) {
                            console.log('formattedError----', formattedError);
                            return formattedError;
                        }
                    });
                    return [4, server.start()];
                case 1:
                    _a.sent();
                    app.use(express_1.default.json());
                    app.use(express_1.default.urlencoded({ extended: true }));
                    app.use('/api', (0, api_route_1.createRootRoute)());
                    app.use('/graphql', (0, cors_1.default)(), (0, express4_1.expressMiddleware)(server, {
                        context: context_1.default
                    }));
                    app.use(function (err, req, res, next) {
                        console.log('err-----', err);
                        if (!err.status || (err.status >= 500 && err.status <= 599)) {
                            err.status = 500;
                            err.code = 'INTERNAL_ERROR';
                            err.message = 'Internal error';
                        }
                        res.status(err.status).json({
                            code: err.code,
                            message: err.message,
                            data: null
                        });
                    });
                    httpServer.listen({ port: 4002 }, function () {
                        console.log('🚀 Server ready at http://localhost:4002/');
                    });
                    return [2];
            }
        });
    });
}
start().catch(function () { });
//# sourceMappingURL=index.js.map