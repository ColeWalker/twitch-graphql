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
System.register("RefreshToken", ["axios", "twitch/lib"], function (exports_1, context_1) {
    "use strict";
    var axios_1, lib_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (axios_1_1) {
                axios_1 = axios_1_1;
            },
            function (lib_1_1) {
                lib_1 = lib_1_1;
            }
        ],
        execute: function () {
            require('dotenv').config();
            exports_1("default", (function () { return __awaiter(void 0, void 0, void 0, function () {
                var clientId, clientSecret, refreshToken, raw, accessToken, authProvider;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clientId = process.env.USER_ID || '';
                            clientSecret = process.env.SECRET || '';
                            refreshToken = process.env.REFRESH_TOKEN || '';
                            return [4, axios_1.default.post("https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=" + refreshToken + "&client_id=" + clientId + "&client_secret=" + clientSecret)];
                        case 1:
                            raw = _a.sent();
                            accessToken = raw.data.access_token;
                            authProvider = new lib_1.StaticAuthProvider(clientId, accessToken);
                            return [2, authProvider];
                    }
                });
            }); }));
        }
    };
});
System.register("subscriptions/SubCount", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function getCurrentSubCount(userId, twitchClient) {
        return __awaiter(this, void 0, void 0, function () {
            var subscriptions, subCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, twitchClient.helix.subscriptions.getSubscriptions(userId)];
                    case 1:
                        subscriptions = _a.sent();
                        subCount = subscriptions.data.length - 1;
                        console.log(subscriptions.data);
                        return [2, subCount];
                }
            });
        });
    }
    exports_2("default", getCurrentSubCount);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("index", ["express", "twitch", "twitch-pubsub-client", "subscriptions/SubCount", "RefreshToken", "cors"], function (exports_3, context_3) {
    "use strict";
    var express_1, twitch_1, twitch_pubsub_client_1, SubCount_1, RefreshToken_1, cors_1, app;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (express_1_1) {
                express_1 = express_1_1;
            },
            function (twitch_1_1) {
                twitch_1 = twitch_1_1;
            },
            function (twitch_pubsub_client_1_1) {
                twitch_pubsub_client_1 = twitch_pubsub_client_1_1;
            },
            function (SubCount_1_1) {
                SubCount_1 = SubCount_1_1;
            },
            function (RefreshToken_1_1) {
                RefreshToken_1 = RefreshToken_1_1;
            },
            function (cors_1_1) {
                cors_1 = cors_1_1;
            }
        ],
        execute: function () {
            require('dotenv').config();
            app = express_1.default();
            app.use(cors_1.default());
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var channelID, authProvider, apiClient, pubSubClient, latestUser, subs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            channelID = process.env.TWITCH_USER_ID || '';
                            return [4, RefreshToken_1.default()];
                        case 1:
                            authProvider = _a.sent();
                            apiClient = new twitch_1.default({ authProvider: authProvider });
                            pubSubClient = new twitch_pubsub_client_1.default();
                            return [4, pubSubClient.registerUserListener(apiClient)];
                        case 2:
                            _a.sent();
                            latestUser = '';
                            return [4, pubSubClient.onRedemption(channelID, function (message) {
                                    var reward = message.rewardName;
                                    var user = message.userDisplayName;
                                    switch (reward) {
                                        case 'Show your name on screen':
                                            latestUser = user;
                                    }
                                })];
                        case 3:
                            _a.sent();
                            return [4, SubCount_1.default(channelID, apiClient)];
                        case 4:
                            subs = _a.sent();
                            return [4, pubSubClient.onSubscription(channelID, function (message) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, SubCount_1.default(channelID, apiClient)];
                                            case 1:
                                                subs = _a.sent();
                                                return [2];
                                        }
                                    });
                                }); })];
                        case 5:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        }
    };
});
