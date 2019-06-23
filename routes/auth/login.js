// 3rd party
const express = require('express');

// self-defined
const client_credential_auth = require('../../db-operations/auth/client_credentials_auth').auth;
const password_auth = require('../../db-operations/auth/password_auth').auth;

const cors = require('../middleware/cors');
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;

const getValue = require('../help_functions').getValue;
const hasNull = require('../help_functions').hasNull;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const generateToken = require('../../db-operations/auth/token_management').generate_token;
// config
const ErrorCode = require('../../data-structures/ErrorCode');

const loginRouter = express.Router();

loginRouter.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    
    let grant_type = getValue(req.body, 'grant_type');
    let client_id = getValue(req.body, 'client_id');
    if(hasNull(grant_type, client_id)){
        res.statusCode = 400; // bad request;
        res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
        return;
    }
    switch(grant_type){
        case "password":{
            let username = getValue(req.body, 'username');
            let password = getValue(req.body, 'password');
            if(hasNull(username, password)){
                res.statusCode = 400; // bad request;
                res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
                return;
            }
            password_auth(client_id, username, password, (result)=>{
                if(result.success){
                    let token = generateToken(result.value['user_id'], client_id, grant_type);
                    res.statusCode = 200;
                    res.json(SuccessedWithValue(null, token));
                }else{
                    res.statusCode = 400;
                    res.json(result);
                }
                return;
            });
        };break;
        case "client_credentials":{
            let client_secret = getValue(req.body, 'client_secret');
            if(hasNull(client_secret)){
                res.statusCode = 400; // bad request;
                res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
                return;
            }
            client_credential_auth(client_id, client_secret, (result)=>{
                if(result.success){
                    let token = generateToken(null, client_id, grant_type);
                    res.statusCode = 200;
                    res.json(SuccessedWithValue(null, token));
                }else{
                    res.statusCode = 400;
                    res.json(result);
                }
            });
        };break;
        default:{
            res.statusCode = 400;
            res.json(FailedWithReason("Invalid grant type", ErrorCode.InvalidGrantType));
            return;
        };
    }
});

module.exports = loginRouter;