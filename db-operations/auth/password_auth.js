
// 3rd party libraries
const bcrypt = require('bcrypt');

// self-defined
const userDB = require('../../db-models/user/user_db');

const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;

const logger = require('../../logging/logger');
// const and config
const ErrorCode = require('../../data-structures/ErrorCode');

function auth(username, password, callback){
    userDB.findOne({email: username}, (err, _user)=>{
        if(err){
            logger.log(err.message);
            callback(FailedWithReason_Dev(err.message));
        }else if(_user == null){
            callback(FailedWithReason(`Invalid email or password`, ErrorCode.InvalidEmailOrPassword));
        }else{
            bcrypt.compare(password, _user.toObject().hash_password, function(err, res) {
                if(err){
                    logger.log(err.message);
                    callback(FailedWithReason_Dev(err.message));
                }else if(!res){
                    callback(FailedWithReason(`Invalid email or password`, ErrorCode.InvalidEmailOrPassword));
                }else{
                    callback(SuccessedWithValue("Success"));
                }
            });
        }
    });
}

module.exports.auth = auth;