// register a user

// third parties library
const bcrypt = require('bcrypt');

// self-defined
const userDB = require('../../db-models/user/user_db');
const userType = require('../../db-models/user/user_status_types');

const validateEmail = require('../user/helper_functions').validateEmail;
const validatePassword = require('../user/helper_functions').validatePassword;

const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;
const logger = require('../../logging/logger');

const queryUserByEmail = require('./query_user').queryUserByEmail;
// constants and configuration
const saltRounds = 10;

function __createAUser(email, hash, callback){
    let userInstance = {
        email: email,
        hash_password: hash,
    };
    userDB.create(userInstance, (err, user)=>{
        if(err){
            logger.log(err.message);
            callback(FailedWithReason_Dev(err.message));
        }else if(user == null){
            logger.log(`Unable to create user ${email}`);
            callback(FailedWithReason_Dev(`Unable to create user ${email}`));
        }else{
            callback(SuccessedWithValue(user));
        }
    });
}
function registerUser(email, password, callback){
    validateEmail(email, (_result) =>{
        if(_result.success){
            _result = validatePassword(password);
            if(_result.success){
                // hash password
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if(err){
                        logger.log(err.message);
                        callback(FailedWithReason_Dev(err.message));
                    }else{
                        __createAUser(email, hash, (_result)=>{
                            if(!_result.success){
                                callback(_result);
                            }else{
                                queryUserByEmail(email, callback);
                            }
                        });
                    }
                });
            }else{
                callback(_result);
            }
        }else{
            callback(_result);
        }
    });
}
module.exports.registerUser = registerUser;