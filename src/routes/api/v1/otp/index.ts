import { Router } from "express";

const OTPRouter = Router();


OTPRouter.post('/send', (req, res) => {
    res.send('Hello World!');
})


OTPRouter.post('/verify', (req, res) => {
    res.send('Hello World!');
})