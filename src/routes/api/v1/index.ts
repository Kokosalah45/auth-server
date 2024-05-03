import { Router } from "express";
import authRouter from "./auth";

const V1Router = Router();


V1Router.use('/auth', authRouter);



export default V1Router;