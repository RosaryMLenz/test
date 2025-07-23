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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var fs = require("node:fs");
var node_fetch_1 = require("node-fetch");
function fetchMakes() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1.default)('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data.Results.map(function (m) { return m.Make_Name; })];
            }
        });
    });
}
function fetchModelsForMakeYear(make, year) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/".concat(encodeURIComponent(make), "/modelyear/").concat(year, "?format=json");
                    return [4 /*yield*/, (0, node_fetch_1.default)(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data.Results.map(function (r) { return r.Model_Name; })];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var makes, makeModels, _loop_1, _i, makes_1, make, output, make;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('⏳ Fetching makes tagged as "car"...');
                    return [4 /*yield*/, fetchMakes()];
                case 1:
                    makes = _a.sent();
                    makeModels = {};
                    _loop_1 = function (make) {
                        var year, models;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log("\uD83D\uDCE6 Fetching models for: ".concat(make));
                                    year = new Date().getFullYear();
                                    _b.label = 1;
                                case 1:
                                    if (!(year >= new Date().getFullYear() - 4)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, fetchModelsForMakeYear(make, year)];
                                case 2:
                                    models = _b.sent();
                                    if (!models.length)
                                        return [3 /*break*/, 3];
                                    if (!makeModels[make])
                                        makeModels[make] = new Set();
                                    models.forEach(function (model) { return makeModels[make].add(model); });
                                    _b.label = 3;
                                case 3:
                                    year--;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, makes_1 = makes;
                    _a.label = 2;
                case 2:
                    if (!(_i < makes_1.length)) return [3 /*break*/, 5];
                    make = makes_1[_i];
                    return [5 /*yield**/, _loop_1(make)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    output = {};
                    for (make in makeModels) {
                        output[make] = Array.from(makeModels[make]).sort();
                    }
                    fs.writeFileSync('makeModels_cached.json', JSON.stringify(output, null, 2));
                    console.log('✅ Saved as makeModels_cached.json');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error('❌ Script failed:', err);
});
