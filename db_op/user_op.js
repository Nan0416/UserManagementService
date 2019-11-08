// register a user

// third parties library
const bcrypt = require('bcrypt');

// self-defined
const userDB = require('../db_model/user_db');
const forgetPasswordResetDB = require('../db_model/forget_password_reset_facility_db');

const user_return_fields = "username"
// constants and configuration
const salt_rounds = 10;
const password_reset_secret_valid_duration = 30 * 60; // seconds;

function register_user(user, password, callback){
    userDB.findOne({username: user.username}, (err, __user)=>{
        if(err != null){
            callback(err);
        }else if(__user != null){
            callback(new Error("User existed"));
        }else{
            bcrypt.hash(password, salt_rounds, (err, hash) => {
                if(err){
                    callback(err);
                }else{
                    user.hash_password = hash;
                    userDB.create(user, callback);
                }
            })
        }
    });
}

function __reset_password(user, new_password, callback){
    userDB.findOne({username: user.username}, (err, user_)=>{
        if(err != null){
            callback(err);
        }else if(user_ == null){
            callback(new Error("User doesn't exist."));
        }else{
            bcrypt.hash(new_password, salt_rounds, (err, hash) => {
                if(err){
                    callback(err);
                }else{
                    user_.hash_password = hash;
                    user_.save(callback);
                }
            })
        }
    });
}

function reset_password_generate_secret(user, callback){
    bcrypt.hash(Math.random().toString(), 10, (err, secret)=>{
        if(err != null){
            callback(err);
        }else{
            let base64_secret = Buffer.from(secret).toString('base64');
            forgetPasswordResetDB.findOne({username: user.username}, (err, secret_user_mapping)=>{
                if(err != null){
                    callback(err);
                }else if(secret_user_mapping == null){
                    forgetPasswordResetDB.create({username: user.username, secret: base64_secret}, callback);
                }else{
                    secret_user_mapping.secret = base64_secret;
                    secret_user_mapping.save(callback);
                }
            });
        }
    });
}

function reset_password_with_secret(secret, new_password, callback){
    forgetPasswordResetDB.findOne({secret: secret}, (err, secret_user_mapping)=>{
        if(err != null){
            callback(err);
        }else if(secret_user_mapping == null){ // add expired with last update.
            callback(new Error("Invalid secret"));
        }else{
            let secret_issue_time = new Date(secret_user_mapping.updatedAt);
            let current_time = new Date();
            if(current_time.getTime() - secret_issue_time.getTime() > password_reset_secret_valid_duration * 1000){
                callback(new Error("password reset secret expired."));
            }else{
                __reset_password({username: secret_user_mapping.username}, new_password, callback);
            }
        }
    });
}

function verify_user(username, password, callback){
    userDB.findOne({username: username}, "hash_password", (err, user)=>{
        if(err != null){
            callback(err);
        }else if(user == null){
            callback(new Error("User doesn't exist."));
        }else{
            bcrypt.compare(password, user.hash_password, callback);
        }
    });
}

function find_user(username, callback){
    userDB.findOne({username: username}, user_return_fields).lean().exec(callback);
}


module.exports.register_user = register_user;
module.exports.verify_user = verify_user;
module.exports.find_user = find_user;
module.exports.reset_password_with_secret = reset_password_with_secret;
module.exports.reset_password_generate_secret = reset_password_generate_secret;
