import { Router } from "express";
import crypto from "node:crypto";

import { BadRequestError, CustomServerError } from "../../../../errors";
import StateManagerService from "../../../../services/state";
import getRedisInstance from "../../../../config/redis";
import { SignJWT } from "jose";
import getDB from "../../../../config/db";
import config from "../../../../config/config";

const authRouter = Router();

authRouter.post("/logout", (req, res) => {
  res.send("Hello World!");
});

authRouter.get("/authorize", async (req, res) => {
  const query = req.query as {
    client_id: string;
    redirect_uri_callback: string;
    state: string;
    code_challenge: string;
    code_challenge_method: string;
  };

  console.log({ query });

  const stateData = await StateManagerService.getState(query.state);

  if (!stateData || stateData?.isOTPVerified !== true) {
    return res.redirect(
      `/login?state=${query.state}&client_id=${query.client_id}&redirect_uri_callback=${query.redirect_uri_callback}&code_challenge=${query.code_challenge}&code_challenge_method=${query.code_challenge_method}`
    );
  }

  const authorizationCode = crypto.randomBytes(16).toString("hex");

  const redisInstance = await getRedisInstance();
  await StateManagerService.deleteState(query.state);
  await redisInstance.set(
    `authorization_code:${authorizationCode}`,
    JSON.stringify({
      code_challenge: query.code_challenge,
      code_challenge_method: query.code_challenge_method,
      email: stateData.email,
    }),
    {
      EX: 600,
    }
  );
  return res.redirect(
    `${stateData.redirect_uri_callback}?code=${authorizationCode}`
  );
});

authRouter.post("/token", async (req, res) => {
  const body = req.body as {
    code: string;
    code_verifier: string;
    client_id: string;
  };

  const authorizationCode = body.code;

  const redisInstance = await getRedisInstance();

  const authorizationCodeData = await redisInstance.get(
    `authorization_code:${authorizationCode}`
  );

  if (!authorizationCodeData) {
    throw new BadRequestError("Invalid authorization code");
  }

  const { code_challenge, code_challenge_method, email } = JSON.parse(
    authorizationCodeData
  );

  const codeVerifierHash = crypto
    .createHash(code_challenge_method)
    .update(body.code_verifier)
    .digest("base64url");

  console.log({ codeVerifierHash, code_challenge });

  if (codeVerifierHash !== code_challenge) {
    throw new CustomServerError();
  }

  await redisInstance.del(`authorization_code:${authorizationCode}`);

  const db = await getDB();

  const user = (await db.query("SELECT * FROM users WHERE email = $1", [email]))
    .rows[0];

  const secretKey = crypto.createSecretKey(config.jwtSecret || "", "utf-8");

  const accessToken = await new SignJWT({
    ...user,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("http://localhost:3000")
    .setAudience(body.client_id)
    .setExpirationTime("2h")
    .sign(secretKey);

  const refreshToken = await new SignJWT({
    ...user,
  })
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
});

authRouter.get("/userinfo", (req, res) => {
  res.send("Hello World!");
});

authRouter.get("/refresh", (req, res) => {
  res.send("Hello World!");
});

export default authRouter;
