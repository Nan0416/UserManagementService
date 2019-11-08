const express = require('express');

const cors = require('../middlware/cors');

const verify_client = require('../utilities/client_verification').verify_client;
const generate_token = require('../utilities/token_op').generate_token;
const get_value = require('../utilities/utilities').get_value;
const has_null = require('../utilities/utilities').has_null;
const register_user = require('../db_op/user_op').register_user;

const signup_router = express.Router();

signup_router.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let username = get_value(req.body, 'username');
    let password = get_value(req.body, 'password');
    let client_id = get_value(req.body, 'client_id');
    if(has_null(username, password, client_id)){
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "missing fields."});
        return;
    }
    if(!verify_client(client_id, "password")){ // only password type client can register user.
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "invalid client."});
        return;
    }
    let user = {
        username: username
    }
    register_user(user, password, (err, result)=>{
        if(err != null){
            res.statusCode = 400; // bad request;
            res.json({success: false, reason: err.message});
        }else{
            data = {
                username: username,
                grant_type: "password",
                client_id: client_id
            };
            res.statusCode = 200;
            res.json({success: true, token: generate_token(data)});
        }
    });
});

module.exports = signup_router;