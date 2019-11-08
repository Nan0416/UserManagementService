// register a user

// third parties library
const bcrypt = require('bcrypt');

// self-defined
const userDB = require('../db_model/user_db');
const forgetPasswordResetDB = require('../db_model/forget_password_reset_facility_db');

const user_return_fields = "username email"
// constants and configuration

const salt_rounds = require('../config').secret_config.salt_rounds;
const password_reset_secret_valid_duration = require('../config').secret_config.password_reset_secret_valid_duration; // seconds;

function register_user(user, password, callback){
    bcrypt.hash(password, salt_rounds, (err, hash) => {
        if(err){
            err.statusCode = 500;
            callback(err);
        }else{
            user.hash_password = hash;
            userDB.create(user, (err, __user)=>{
                if(err != null && err.code == 11000){
                    let new_err = new Error("User existed.");
                    new_err.statusCode = 400;
                    callback(new_err);
                }else if(err != null){
                    err.statusCode = 500;
                    callback(err);
                }else{
                    callback(null, {success: true});
                }
            });
        }
    });
}


function __reset_password(user, new_password, callback){
    userDB.findOne({username: user.username}, (err, user_)=>{
        if(err != null){
            err.statusCode = 500;
            callback(err);
        }else if(user_ == null){
            let new_err = new Error("User doesn't exist.");
            new_err.statusCode = 400;
            callback(new_err);
        }else{
            bcrypt.hash(new_password, salt_rounds, (err, hash) => {
                if(err){
                    err.statusCode = 500;
                    callback(err);
                }else{
                    user_.hash_password = hash;
                    user_.save((err, _)=>{
                        if(err != null){
                            err.statusCode = 500;
                            callback(err);
                        }else{
                            callback(null, {success: true});
                        }
                    });
                }
            })
        }
    });
}

function reset_password_generate_secret(user, callback){
    bcrypt.hash(Math.random().toString(), 10, (err, secret)=>{
        if(err != null){
            err.statusCode = 500;
            callback(err);
        }else{
            let base64_secret = Buffer.from(secret).toString('base64');
            forgetPasswordResetDB.findOne({username: user.username}, (err, secret_user_mapping)=>{
                if(err != null){
                    err.statusCode = 500;
                    callback(err);
                }else if(secret_user_mapping == null){
                    forgetPasswordResetDB.create({username: user.username, secret: base64_secret}, (err, _)=>{
                        if(err != null){
                            err.statusCode = 500;
                            callback(err);
                        }else{
                            callback(null, {success: true, secret: base64_secret});
                        }
                    });
                }else{
                    secret_user_mapping.secret = base64_secret;
                    secret_user_mapping.save((err, _)=>{
                        if(err != null){
                            err.statusCode = 500;
                            callback(err);
                        }else{
                            callback(null, {success: true, secret: base64_secret});
                        }
                    });
                }
            });
        }
    });
}

function reset_password_with_secret(secret, new_password, callback){
    forgetPasswordResetDB.findOne({secret: secret}, (err, secret_user_mapping)=>{
        if(err != null){
            err.statusCode = 500;
            callback(err);
        }else if(secret_user_mapping == null){ // invalid secret
            let new_err = new Error("Invalid secret");
            new_err.statusCode = 400;
            callback(new_err);
        }else{
            let secret_issue_time = new Date(secret_user_mapping.updatedAt);
            let current_time = new Date();
            if(current_time.getTime() - secret_issue_time.getTime() > password_reset_secret_valid_duration * 1000){ // secret expired.
                let new_err = new Error("password reset secret expired.");
                new_err.statusCode = 400;
                callback(new_err);
            }else{
                __reset_password({username: secret_user_mapping.username}, new_password, callback);
            }
        }
    });
}

function verify_user(user, password, callback){
    userDB.findOne(user, "hash_password", (err, user_)=>{
        if(err != null){
            err.statusCode = 500;
            callback(err);
        }else if(user_ == null){
            let new_err = new Error("Invalid username or password");
            new_err.statusCode = 400;
            callback(new_err);
        }else{
            bcrypt.compare(password, user_.hash_password, (err, same)=>{
                if(err != null){
                    err.statusCode = 500;
                    callback(err);
                }else if(!same){
                    let new_err = new Error("Invalid username or password");
                    new_err.statusCode = 400;
                    callback(new_err);
                }else{
                    callback(null, {success: true});
                }
            });
        }
    });
}

function find_user(user, callback){
    userDB.findOne(user, user_return_fields).lean().exec((err, user)=>{
        if(err != null){
            err.statusCode = 500;
            callback(err);
        }else{
            callback(null, {success: user != null, value: user});
        }
    });
}


module.exports.register_user = register_user;
module.exports.verify_user = verify_user;
module.exports.find_user = find_user;
module.exports.reset_password_with_secret = reset_password_with_secret;
module.exports.reset_password_generate_secret = reset_password_generate_secret;
