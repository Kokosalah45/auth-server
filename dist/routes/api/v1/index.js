"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const otp_1 = __importDefault(require("./otp"));
const V1Router = (0, express_1.Router)();
V1Router.use("/auth", auth_1.default);
V1Router.use("/otp", otp_1.default);
exports.default = V1Router;
//# sourceMappingURL=index.js.map