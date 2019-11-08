const express = require('express');

const cors = require('../middlware/cors');

const verify_client = require('../utilities/client_verification').verify_client;
const get_value = require('../utilities/utilities').get_value;
const has_null = require('../utilities/utilities').has_null;
const reset_password_with_secret = require('../db_op/user_op').reset_password_with_secret;
const reset_password_generate_secret = require('../db_op/user_op').reset_password_generate_secret;
const find_user = require('../db_op/user_op').find_user;
const send_email = require('../utilities/email').send_email;
/**
 * Two methods to reset password,
 * 1). forget old password, then get a reset link that includes the reset secret.
 * 2). reset password by providing old password.
 * Here this router only deals with the first senario.
*/
const reset_password_router = express.Router();

reset_password_router.route("/reset")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let secret = get_value(req.body, 'secret');
    let new_password = get_value(req.body, 'new_password');
    let client_id = get_value(req.body, 'client_id');
    if(has_null(secret, new_password, client_id)){
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "missing fields."});
        return;
    }
    if(!verify_client(client_id, "password")){ // only password type client can forget password.
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "invalid client."});
        return;
    }
    reset_password_with_secret(secret, new_password, (err, result)=>{
        if(err != null){
            res.statusCode = 400; // bad request;
            res.json({success: false, reason: err.message});
        }else{
            res.statusCode = 200;
            res.json({success: true});
        }
    });
});


// generate a reset password secret
reset_password_router.route("/secret")
.options(cors.cors_allow_whitelist, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors_allow_whitelist, (req, res, next)=>{
    let user_email_addr = get_value(req.body, 'email');
    let client_id = get_value(req.body, 'client_id');
    if(has_null(user_email_addr, client_id)){
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "missing fields."});
        return;
    }
    if(!verify_client(client_id, "password")){ // only password type client can forget password.
        res.statusCode = 400; // bad request;
        res.json({success: false, reason: "invalid client."});
        return;
    }
    let search_condition = {email: user_email_addr};
    find_user(search_condition, (err, result)=>{
        if(err != null){
            next(err);
        }else if(!result.success){
            res.statusCode = 400; // bad request;
            res.json({success: false, reason: "User doesn't exist."});
        }else{
            reset_password_generate_secret({username: result.value.username}, (err, result)=>{
                if(err != null){
                    next(err);
                }else{
                    let email_= {
                        title: "You reset link",
                        body: `${result.secret}`
                    };
                    send_email(user_email_addr, email_, (err, _)=>{
                        if(err != null){
                            next(err);
                        }else{
                            res.statusCode = 200;
                            res.json({success: true});
                        }
                    });
                }
            });
        }
    });
});

module.exports = reset_password_router;