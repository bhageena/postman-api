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
var invoker_1 = require("@nimbella/postman-api/lib/invoker");
var path_1 = require("path");
var nimbella_cli_1 = require("nimbella-cli");
// import { initializeAPI, Flags, deployProject, readAndPrepare, fileSystemPersister, wipePackage, buildProject, deploy, getCurrentNamespace, Credentials, OWOptions, getCredentialsFromEnvironment } from 'nimbella-deployer'
var deployer_1 = require("nimbella-cli/lib/deployer");
function main(args) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log(args);
                    console.log(args.__ow_headers);
                    return [4 /*yield*/, nimGenerate(args.collection, args.pm_key)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, nimProjectDeploy(args.collection, args.nim_token)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, error_1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nimGenerate(collection, pm_key) {
    return __awaiter(this, void 0, void 0, function () {
        var generator;
        return __generator(this, function (_a) {
            generator = new invoker_1["default"]({
                id: collection,
                key: pm_key,
                language: 'ts',
                overwrite: false,
                deploy: false,
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
function nimProjectDeploy(collection_id, nim_token) {
    return __awaiter(this, void 0, void 0, function () {
        var projPath, flags, cred;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projPath = path_1.join(process.cwd(), collection_id);
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
                    // const cred: Credentials = {
                    //   namespace: await getCurrentNamespace(fileSystemPersister),
                    //   ow: owOptions,
                    //   storageKey: undefined,
                    //   redis: false
                    // }
                    // const pj = require('package.json')
                    return [4 /*yield*/, loginUsingToken(nim_token)
                        // initializeAPI(userAgent)
                    ];
                case 1:
                    // const cred: Credentials = {
                    //   namespace: await getCurrentNamespace(fileSystemPersister),
                    //   ow: owOptions,
                    //   storageKey: undefined,
                    //   redis: false
                    // }
                    // const pj = require('package.json')
                    _a.sent();
                    cred = deployer_1.getCredentialsFromEnvironment();
                    deployer_1.deployProject(projPath, cred.ow, cred, deployer_1.fileSystemPersister, flags);
                    return [2 /*return*/];
            }
        });
    });
}
function loginUsingToken(token) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nimbella_cli_1.runNimCommand('auth/login', [token])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getNamespace() {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, nimbella_cli_1.runNimCommand('auth/current', [])];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.captured[0]];
                case 2:
                    e_1 = _a.sent();
                    console.log('getNamespace Error:', e_1.message);
                    return [2 /*return*/, { error: e_1.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
module.exports = { main: main };
 
