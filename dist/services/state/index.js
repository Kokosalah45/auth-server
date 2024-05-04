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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../../config/redis"));
class StateManagerService {
    static addState(state, stateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const redis = yield (0, redis_1.default)();
            redis.set(`state:${state}`, JSON.stringify(stateData), {
                EX: this.stateTimeout,
            });
        });
    }
    static getState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const redis = yield (0, redis_1.default)();
            const stateData = yield redis.get(`state:${state}`);
            if (!stateData)
                return null;
            return JSON.parse(stateData);
        });
    }
    static deleteState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const redis = yield (0, redis_1.default)();
            redis.del(`state:${state}`);
        });
    }
}
_a = StateManagerService;
StateManagerService.stateTimeout = 120;
StateManagerService.isExist = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const redis = yield (0, redis_1.default)();
    const stateData = yield redis.get(`state:${state}`);
    return !!stateData;
});
exports.default = StateManagerService;
//# sourceMappingURL=index.js.map