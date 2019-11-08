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
            if(!verify_client(client_id, "password")){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "invalid client."});
                return;
            }

            let username = get_value(req.body, 'username');
            let email = get_value(req.body, 'email');
            let password = get_value(req.body, 'password');
            if(password == null || (username == null && email == null)){
                res.statusCode = 400; // bad request;
                res.json({success: false, reason: "missing fields."});
                return;
            }

            let search_condition = {};
            if(username != null){
                search_condition.username = username;
            }else{
                search_condition.email = email;
            }
            verify_user(search_condition, password, (err, _)=>{
                if(err){
                    next(err);
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