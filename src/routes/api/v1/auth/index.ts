import { Router } from "express";

import { BadRequestError } from "../../../../errors";

import crypto from "node:crypto";
import State from "../../../../services/state";

const authRouter = Router();

const ALLOWED_CLIENTS = ["1234"];

authRouter.post("/register", (req, res) => {
  res.send("Hello World!");
});

authRouter.post("/logout", (req, res) => {
  res.send("Hello World!");
});

authRouter.post("/authorize", (req, res) => {
  const {
    client_id,
    redirect_uri_callback,
    state,
    code_challenge,
    code_challenge_method,
  } = req.query as {
    client_id: string;
    redirect_uri_callback: string;
    state: string;
    code_challenge: string;
    code_challenge_method: string;
  };

  // if(!ALLOWED_CLIENTS.includes(client_id as string)) {
  //     throw new BadRequestError("Client is not allowed to access this resource");
  // }

  // if(!client_id || !redirect_uri_callback || !state || !code_challenge || !code_challenge_method) {
  //     throw new BadRequestError("Missing required parameters");
  // }

  State.addState(state as string, {
    code_challenge,
    code_challenge_method,
    redirect_uri_callback,
  });

  return res.render(`pages/login`);
});

authRouter.post("/token", (req, res) => {
  res.send("Hello World!");
});

authRouter.get("/userinfo", (req, res) => {
  res.send("Hello World!");
});

authRouter.post("/refresh", (req, res) => {
  res.send("Hello World!");
});

export default authRouter;
