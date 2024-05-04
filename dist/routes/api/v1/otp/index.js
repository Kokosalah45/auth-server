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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailer_1 = __importDefault(require("../../../../services/mailer"));
const errors_1 = require("../../../../errors");
const redis_1 = __importDefault(require("../../../../config/redis"));
const db_1 = __importDefault(require("../../../../config/db"));
const state_1 = __importDefault(require("../../../../services/state"));
const OTPRouter = (0, express_1.Router)();
OTPRouter.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const redisInstance = yield (0, redis_1.default)();
        const isStoredOTP = yield redisInstance.get(`otp:${email}`);
        if (isStoredOTP) {
            return res.status(400).json({
                message: "OTP is already sent",
            });
        }
        const randomOTP = Math.floor(1000 + Math.random() * 9000).toString();
        const mailer = new mailer_1.default();
        yield mailer.sendMail(email, "OTP", randomOTP);
        yield redisInstance.set(`otp:${email}`, randomOTP, {
            EX: 60 * 60 * 2,
        });
        res.json({
            message: "OTP sent",
        });
    }
    catch (error) {
        console.error(error);
        throw new errors_1.CustomServerError();
    }
}));
OTPRouter.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const { code_challenge, code_challenge_method, redirect_uri_callback, state, } = req.query;
        const redisInstance = yield (0, redis_1.default)();
        const storedOTP = yield redisInstance.get(`otp:${email}`);
        if (storedOTP === otp) {
            redisInstance.del(`otp:${email}`);
            const db = yield (0, db_1.default)();
            console.log({ db });
            const query = yield db.query(`select * from users where email = $1`, [
                email,
            ]);
            if (query.rowCount === 0) {
                yield db.query(`insert into users (email , first_name , last_name) values ($1 , '' , '') returning *`, [email]);
            }
            yield state_1.default.addState(state, {
                code_challenge,
                code_challenge_method,
                redirect_uri_callback,
                email,
                isOTPVerified: true,
            });
            return res.json({
                message: "OTP is valid",
            });
        }
        res.status(401).json({
            message: "OTP is invalid",
        });
    }
    catch (error) {
        console.log({ error });
        throw new errors_1.CustomServerError();
    }
}));
exports.default = OTPRouter;
//# sourceMappingURL=index.js.map