import { Router } from "express";
import Mailer from "@/services/mailer";
import { CustomServerError } from "@/errors";
import getRedisInstance from "@/config/redis";
import getDB from "@/config/db";
import StateManagerService from "@/services/state";

const OTPRouter = Router();

OTPRouter.post("/send", async (req, res) => {
  try {
    const { email } = req.body as { email: string };

    const redisInstance = await getRedisInstance();

    const isStoredOTP = await redisInstance.get(`otp:${email}`);

    if (isStoredOTP) {
      return res.status(400).json({
        message: "OTP is already sent",
      });
    }

    const randomOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const mailer = new Mailer();

    await mailer.sendMail(email, "OTP", randomOTP);

    await redisInstance.set(`otp:${email}`, randomOTP, {
      EX: 60 * 60 * 2,
    });

    res.json({
      message: "OTP sent",
    });
  } catch (error) {
    console.error(error);

    throw new CustomServerError();
  }
});

OTPRouter.post("/verify", async (req, res) => {
  try {
    const { otp, email } = req.body as { otp: string; email: string };
    const {
      code_challenge,
      code_challenge_method,
      redirect_uri_callback,
      state,
    } = req.query as {
      client_id: string;
      redirect_uri_callback: string;
      state: string;
      code_challenge: string;
      code_challenge_method: string;
    };

    const redisInstance = await getRedisInstance();
    const storedOTP = await redisInstance.get(`otp:${email}`);

    if (storedOTP === otp) {
      redisInstance.del(`otp:${email}`);

      const db = await getDB();
      console.log({ db });
      const query = await db.query(`select * from users where email = $1`, [
        email,
      ]);

      if (query.rowCount === 0) {
        await db.query(
          `insert into users (email , first_name , last_name) values ($1 , '' , '') returning *`,
          [email]
        );
      }
      await StateManagerService.addState(state, {
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
  } catch (error) {
    console.log({ error });
    throw new CustomServerError();
  }
});

export default OTPRouter;
