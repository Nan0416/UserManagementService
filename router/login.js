// 3rd party
const express = require('express');

const cors = require('../middlware/cors');

const verify_client = require('../utilities/client_verification').verify_client;
const valid_clients = require('../config').valid_clients;
const generate_token = require('../utilities/token_op').generate_token;
const get_value = require('../utilities/utilities').get_value;
const has_null = require('../utilities/utilities').has_null;
const verify_user = require('../db_op/user_op').verify_user;

const login_router = express.Router();

login_router.route("/")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let grant_type = get_value(req.body, 'grant_type');
    let client_id = get_value(req.body, 'client_id');
    if(has_null(grant_type, client_id)){
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "missing fields."});
        return;
    }

    switch(grant_type){
        case "password":{
            let username = get_value(req.body, 'username');
            let password = get_value(req.body, 'password');
            if(has_null(username, password)){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "missing fields."});
                return;
            }

            if(!verify_client(client_id, grant_type)){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "invalid client."});
                return;
            }

            verify_user(username, password, (err, result)=>{
                if(err){
                    res.statusCode = 400; // bad request;
                    res.json({success: false, reason: err.message});
                }else if(!result){
                    res.statusCode = 400; // bad request;
                    res.json({success: false, reason: "invalid password."});
                }else{
                    data = {
                        username: username,
                        grant_type: grant_type,
                        client_id: client_id
                    };
                    res.statusCode = 200;
                    res.json({success: true, token: generate_token(data)});
                }
            })
        };break;
        case "client_credentials":{
            let client_secret = get_value(req.body, 'client_secret');
            if(has_null(client_secret)){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "missing fields."});
                return;
            }
            
            if(!verify_client(client_id, grant_type, {"client_secret": client_secret})){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "invalid client."});
                return;
            }

            data = {
                username: null,
                grant_type: grant_type,
                client_id: client_id
            };

            res.statusCode = 200;
            res.json({success: true, token: generate_token(data)});

        };break;
        default:{
            res.statusCode = 400;
            res.json({success: false, reason: "grant_type doesn't support."});
            return;
        };
    }
});

module.exports = login_router;