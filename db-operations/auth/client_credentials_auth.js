
// self-defined
const GetEmptyResult = require('../../data-structures/Result').GetEmptyResult;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;
const FailedWithReason_Dev = require('../../data-structures/Result').FailedWithReason_Dev;

const generate_token = require('./token_management').generate_token;
const logger = require('../../logging/logger');
// const and config
const ErrorCode = require('../../data-structures/ErrorCode');
const verifyClient = require('./valid_clients').verifyClient;

function auth(client_id, client_secret, callback){
    let temp = verifyClient(client_id, "client_credentials", {
        client_secret: client_secret
    });
    if(temp){
        callback(SuccessedWithValue({
            user_id: null,
            client_id: client_id,
            grant_type: 'client_credentials'
        }));
    }else{
        callback(FailedWithReason(`Invalid client id or client secret`, ErrorCode.InvalidClientIdOrCredential));
    }
}

module.exports.auth = auth;
