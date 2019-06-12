// 3rd parties library

// self-defined

const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;

const queryUserByEmail = require('./query_user').queryUserByEmail;

// constants and configurations




function validatePassword(password){

    //TODO

    return SuccessedWithValue(password);
}
function __validateEmailFormat(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validateEmail(email, callback){
    // validate email
    if(!__validateEmailFormat(email)){
        return FailedWithReason(`${email} is not a valid email address.`);
    }
    // validate that the email is not registered.
    queryUserByEmail(email, (_result)=>{
        if(_result.success){
            // the email is already registered.
            callback(FailedWithReason(`${email} is already registered.`));
        }else{
            callback(SuccessedWithValue(email));
        }
    });
}

module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;