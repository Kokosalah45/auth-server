import { Router } from "express";

import { BadRequestError } from "../../../../errors";

const authRouter = Router();



authRouter.post('/register', (req, res) => {
    res.send('Hello World!');
})

authRouter.post('/login', (req, res) => {
    res.send('Hello World!');
})


authRouter.post('/logout', (req, res) => {
    res.send('Hello World!');
})


authRouter.post('/authorize', (req, res , next) => {
    
  
    const { client_id, response_type, redirect_uri, state , code_challenge } = req.query;

    if (!client_id || !response_type || !redirect_uri || !state || !code_challenge) {
        throw new BadRequestError("The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.")
    }

    res.send('Hello World!');
})

authRouter.post('/token', (req, res) => {
    res.send('Hello World!');
})


authRouter.get('/userinfo', (req, res) => {
    res.send('Hello World!');
});


authRouter.post('/refresh', (req, res) => {
    res.send('Hello World!');
})



export default authRouter;