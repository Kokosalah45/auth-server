import { Router } from "express";
import authRouter from "./auth";
import OTPRouter from "./otp";

const V1Router = Router();

V1Router.use("/auth", authRouter);
V1Router.use("/otp", OTPRouter);

export default V1Router;
