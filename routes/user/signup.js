// 3rd party
const express = require('express');

// self-defined
const registerUser = require('../../db-operations/user/register_user').registerUser;
const cors = require('../middleware/cors');
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;

const getValue = require('../help_functions').getValue;
const hasNull = require('../help_functions').hasNull;
const verifyClient = require('../../db-operations/auth/valid_clients').verifyClient;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const generateToken = require('../../db-operations/auth/token_management').generate_token;
// config
const ErrorCode = require('../../data-structures/ErrorCode');

const signupRouter = express.Router();

signupRouter.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let username = getValue(req.body, 'username');
    let password = getValue(req.body, 'password');
    let client_id = getValue(req.body, 'client_id');
    if(hasNull(username, password, client_id)){
        res.statusCode = 400; // bad request;
        res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
        return;
    }
    if(!verifyClient(client_id, 'password')){
        res.statusCode = 400; // bad request;
        res.json(FailedWithReason(`Invalid client id`, ErrorCode.InvalidClientId));
        return;
    }
    registerUser(username, password, (result)=>{
        if(result.success){
            // generate token
            let user_id = getValue(result.value, '_id');
            let token = generateToken(user_id, client_id, 'password');
            res.statusCode = 200;
            res.json(SuccessedWithValue(result.value, token));
        }else{
            res.statusCode = 400;
            res.json(result);   
        }
    });
});

module.exports = signupRouter;