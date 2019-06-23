
// 3rd party libraries
const bcrypt = require('bcrypt');

// self-defined
const userDB = require('../../db-models/user/user_db');

const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;

const generate_token = require('./token_management').generate_token;
const logger = require('../../logging/logger');
// const and config
const ErrorCode = require('../../data-structures/ErrorCode');
const verifyClient = require('./valid_clients').verifyClient;


function auth(client_id, username, password, callback){
    if(!verifyClient(client_id, 'password')){
        return callback(FailedWithReason(`Invalid client id.`, ErrorCode.InvalidClientId));
    }
    userDB.findOne({email: username}, (err, _user)=>{
        if(err){
            logger.error(err.message);
            callback(FailedWithReason_Dev(err.message));
        }else if(_user == null){
            logger.info(`Email ${username} does not existed.`);
            callback(FailedWithReason(`Invalid email or password`, ErrorCode.InvalidEmailOrPassword));
        }else{
            bcrypt.compare(password, _user.toObject().hash_password, function(err, res) {
                if(err){
                    logger.error(err.message);
                    callback(FailedWithReason_Dev(err.message));
                }else if(!res){
                    logger.info(`Invalid password for ${username}.`);
                    callback(FailedWithReason(`Invalid email or password`, ErrorCode.InvalidEmailOrPassword));
                }else{
                    callback(SuccessedWithValue({
                        user_id: _user._id.toString(),
                        client_id: client_id,
                        grant_type: 'password'
                    }));
                }
            });
        }
    });
}

module.exports.auth = auth;
