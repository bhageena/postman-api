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
        while (_) try {
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
exports.__esModule = true;
var nimbella_deployer_1 = require("nimbella-deployer");
var invoker_1 = require("@nimbella/postman-api/lib/invoker");
var fs_1 = require("fs");
var path_1 = require("path");
function main(args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, nimGenerate(args.collection_id, args.postman_key)];
                case 1:
                    _c.sent();
                    _a = nimProjectDeploy;
                    _b = [args.collection_id, args.nimbella_key];
                    return [4 /*yield*/, nimbella_deployer_1.getCurrentNamespace(nimbella_deployer_1.fileSystemPersister)];
                case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error(error_1);
                    return [2 /*return*/, error_1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function nimGenerate(collection_id, postman_key) {
    return __awaiter(this, void 0, void 0, function () {
        var generator;
        return __generator(this, function (_a) {
            generator = new invoker_1["default"]({
                id: collection_id,
                key: postman_key,
                language: 'ts',
                overwrite: false,
                deploy: true,
                deployForce: false,
                updateSource: false,
                clientCode: false,
                update: false,
                init: false
            });
            generator.generate()["catch"](function (error) {
                console.log('Oops! Some Error Occurred, Please Try Again');
                console.error(error);
            });
            return [2 /*return*/];
        });
    });
}
function nimDeploy(collection_id, nim_auth_key, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var prepare, _a, _b, _c, build, deployResponse;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = nimbella_deployer_1.readAndPrepare;
                    _b = [path_1.dirname(path_1.join(process.cwd(), collection_id, 'project.yml')),
                        {}];
                    _c = {};
                    return [4 /*yield*/, nimbella_deployer_1.getCurrentNamespace(nimbella_deployer_1.fileSystemPersister)];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.namespace = _d.sent(),
                            _c.ow = {
                                apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
                                api_key: nim_auth_key
                            },
                            _c.storageKey = undefined,
                            _c.redis = false,
                            _c), nimbella_deployer_1.fileSystemPersister,
                        {
                            verboseBuild: false,
                            verboseZip: false,
                            production: false,
                            incremental: false,
                            yarn: false,
                            env: undefined,
                            webLocal: undefined,
                            include: undefined,
                            exclude: undefined,
                            remoteBuild: false
                        }, ""]))];
                case 2:
                    prepare = _d.sent();
                    return [4 /*yield*/, nimbella_deployer_1.buildProject(prepare)];
                case 3:
                    build = _d.sent();
                    if (!build) {
                        Object.assign(process.env, { __OW_NAMESPACE: namespace });
                        fs_1.existsSync(path_1.join(process.cwd(), collection_id)) && fs_1.rmdirSync(path_1.join(process.cwd(), collection_id), { recursive: true });
                        throw new Error(collection_id + " Couldn't build project.");
                    }
                    return [4 /*yield*/, nimbella_deployer_1.deploy(build)];
                case 4:
                    deployResponse = _d.sent();
                    if (!(deployResponse.failures && deployResponse.failures.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, nimbella_deployer_1.wipePackage(collection_id, process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME, nim_auth_key)];
                case 5:
                    _d.sent();
                    throw new Error(collection_id + " Couldn't deploy.");
                case 6:
                    Object.assign(process.env, { __OW_NAMESPACE: namespace });
                    if (collection_id && fs_1.existsSync(path_1.join(process.cwd(), collection_id))) {
                        fs_1.rmdirSync(path_1.join(process.cwd(), collection_id), { recursive: true });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function nimProjectDeploy(collection_id, nim_auth_key, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var projPath, owOptions, flags, cred, _a, userAgent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    projPath = path_1.join(process.cwd(), collection_id);
                    owOptions = {
                        apihost: process.env.CREATE_WHISK_USER_DEFAULT_HOSTNAME,
                        api_key: nim_auth_key
                    };
                    flags = {
                        verboseBuild: false,
                        verboseZip: false,
                        production: false,
                        incremental: false,
                        yarn: false,
                        env: undefined,
                        webLocal: undefined,
                        include: undefined,
                        exclude: undefined,
                        remoteBuild: false
                    };
                    _a = {};
                    return [4 /*yield*/, nimbella_deployer_1.getCurrentNamespace(nimbella_deployer_1.fileSystemPersister)];
                case 1:
                    cred = (_a.namespace = _b.sent(),
                        _a.ow = owOptions,
                        _a.storageKey = undefined,
                        _a.redis = false,
                        _a);
                    userAgent = 'postman-api/0.0.0';
                    nimbella_deployer_1.initializeAPI(userAgent);
                    nimbella_deployer_1.deployProject(projPath, owOptions, cred, nimbella_deployer_1.fileSystemPersister, flags);
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = { main: main };
