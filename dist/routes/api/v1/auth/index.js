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
const node_crypto_1 = __importDefault(require("node:crypto"));
const errors_1 = require("../../../../errors");
const state_1 = __importDefault(require("../../../../services/state"));
const redis_1 = __importDefault(require("../../../../config/redis"));
const jose_1 = require("jose");
const db_1 = __importDefault(require("../../../../config/db"));
const config_1 = __importDefault(require("../../../../config/config"));
const authRouter = (0, express_1.Router)();
authRouter.post("/logout", (req, res) => {
    res.send("Hello World!");
});
authRouter.get("/authorize", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const stateData = yield state_1.default.getState(query.state);
    if (!stateData || (stateData === null || stateData === void 0 ? void 0 : stateData.isOTPVerified) !== true) {
        return res.redirect(`/login?state=${query.state}&client_id=${query.client_id}&redirect_uri_callback=${query.redirect_uri_callback}&code_challenge=${query.code_challenge}&code_challenge_method=${query.code_challenge_method}`);
    }
    const authorizationCode = node_crypto_1.default.randomBytes(16).toString("hex");
    const redisInstance = yield (0, redis_1.default)();
    yield state_1.default.deleteState(query.state);
    yield redisInstance.set(`authorization_code:${authorizationCode}`, JSON.stringify({
        code_challenge: query.code_challenge,
        code_challenge_method: query.code_challenge_method,
        email: stateData.email,
    }), {
        EX: 600,
    });
    return res.redirect(`${stateData.redirect_uri_callback}?code=${authorizationCode}`);
}));
authRouter.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const authorizationCode = body.code;
    const redisInstance = yield (0, redis_1.default)();
    const authorizationCodeData = yield redisInstance.get(`authorization_code:${authorizationCode}`);
    if (!authorizationCodeData) {
        throw new errors_1.BadRequestError("Invalid authorization code");
    }
    const { code_challenge, code_challenge_method, email } = JSON.parse(authorizationCodeData);
    const codeVerifierHash = node_crypto_1.default
        .createHash(code_challenge_method)
        .update(body.code_verifier)
        .digest("base64url");
    console.log({ codeVerifierHash, code_challenge });
    if (codeVerifierHash !== code_challenge) {
        throw new errors_1.CustomServerError();
    }
    yield redisInstance.del(`authorization_code:${authorizationCode}`);
    const db = yield (0, db_1.default)();
    const user = (yield db.query("SELECT * FROM users WHERE email = $1", [email]))
        .rows[0];
    const secretKey = node_crypto_1.default.createSecretKey(config_1.default.jwtSecret || "", "utf-8");
    const accessToken = yield new jose_1.SignJWT(Object.assign({}, user))
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("http://localhost:3000")
        .setAudience(body.client_id)
        .setExpirationTime("2h")
        .sign(secretKey);
    const refreshToken = yield new jose_1.SignJWT(Object.assign({}, user))
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setAudience(body.client_id)
        .setIssuer("http://localhost:3000")
        .setExpirationTime("1m")
        .sign(secretKey);
    console.log({ user, accessToken, refreshToken });
    return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
    });
}));
authRouter.get("/userinfo", (req, res) => {
    res.send("Hello World!");
});
authRouter.get("/refresh", (req, res) => {
    res.send("Hello World!");
});
exports.default = authRouter;
//# sourceMappingURL=index.js.map