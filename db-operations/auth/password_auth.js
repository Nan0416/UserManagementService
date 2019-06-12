
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
const VALID_CLIENTS = require('./valid_clients');
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
function verify_client_id(client_id){
    if(VALID_CLIENTS[client_id] === "OK"){
        return SuccessedWithValue(client_id);
    }else{
        return FailedWithReason(`Invalid client id ${client_id}`, ErrorCode.InvalidClientId);
    }
}
module.exports.auth = auth;
moduel.exports.verify_client_id = verify_client_id;