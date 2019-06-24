// 3rd party
const express = require('express');

// self-defined
const queryUserByEmail = require('../../db-operations/user/query_user').queryUserByEmail;
const queryUserById = require('../../db-operations/user/query_user').queryUserById;
const cors = require('../middleware/cors');
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;

const getValue = require('../help_functions').getValue;
const hasNull = require('../help_functions').hasNull;
const verifyClient = require('../../db-operations/auth/valid_clients').verifyClient;
const SuccessedWithValue = require('../../data-structures/Result').SuccessedWithValue;
const generateToken = require('../../db-operations/auth/token_management').generate_token;

const verifyToken = require('../middleware/token_verification');
// config
const ErrorCode = require('../../data-structures/ErrorCode');

// helper functions
function __validateEmailFormat(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function handleResult(token, result, response){
    if(result.success){
        if(token['grant_type'] === 'client_credentials' || token['user_id'] === result.value._id.toString()){
            response.statusCode = 200;
            response.json(result);
        }else{
            response.statusCode = 400;
            response.json(FailedWithReason('Invalid User Id', ErrorCode.InvalidUserId));
        }
    }else{
        response.statusCode = 400;
        response.json(result);
    }
}

const queryRouter = express.Router();

queryRouter.route("/")
.get(verifyToken((token, callback)=>{
    callback({success: true});
}), (req, res, next)=>{
    // console.log(req.token);
    let userId = getValue(req.token, 'user_id');
    let grant_type = getValue(req.token, 'grant_type');
    let id = getValue(req.query, 'id');
    let email = getValue(req.query, 'email');
    
    if(grant_type === 'client_credentials'){
        // allow client credential to query user.
        if(id != null){
            queryUserById(id, (result)=>{
                handleResult(req.token, result, res);
            });
        }else if(email !=null){
            if(!__validateEmailFormat(email)){
                res.statusCode = 400;
                res.json(FailedWithReason("Invalid email format", ErrorCode.InvalidEmailFormat));
            }else{
                queryUserByEmail(email, (result)=>{
                    handleResult(req.token, result, res);
                });
            }
        }else{
            res.statusCode = 400;
            res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
        }
    }else if(grant_type === 'password'){
        if(id != null){
            queryUserById(id, (result)=>{
                handleResult(req.token, result, res);
            });
        }else if(email !=null){
            if(!__validateEmailFormat(email)){
                res.statusCode = 400;
                res.json(FailedWithReason("Invalid email format", ErrorCode.InvalidEmailFormat));
            }else{
                queryUserByEmail(email, (result)=>{
                    handleResult(req.token, result, res);
                });
            }
        }else{
            res.statusCode = 400;
            res.json(FailedWithReason("Missing fields", ErrorCode.MissingFields));
        }
    }else{
        res.statusCode = 400;
        res.json(FailedWithReason("Invalid grant type", ErrorCode.InvalidGrantType));
    }
});

module.exports = queryRouter;