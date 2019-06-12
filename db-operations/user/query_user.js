
// query a user by email
// query a user by id

// third parties library
// self-defined
const userDB = require('../../db-models/user/user_db');

const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;
const logger = require('../../logging/logger');

// constants and configuration
const user_selected_fields = "email first_name last_name type profile status"; // except hash

function queryUserByEmail(email, callback){
    userDB.findOne({email: email}, user_selected_fields, (err, _user)=>{
        if(err){
            logger.log(err.message);
            callback(FailedWithReason_Dev(err.message));
        }else if(_user == null){
            callback(FailedWithReason(`Cannot find user with email ${email}`));
        }else{
            callback(SuccessedWithValue(_user.toObject()));
        }
    });
}
module.exports.queryUserByEmail = queryUserByEmail;