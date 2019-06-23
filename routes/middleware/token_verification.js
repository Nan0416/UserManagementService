
// self-defined
const verify_token = require('../../db-operations/auth/token_management').verify_token;
const FailedWithReason = require('../../data-structures/Result').FailedWithReason;

// config
const ErrorCode = require('../../data-structures/ErrorCode');
function token_verification(req, res, next){
    let token = req.headers['authorization'] || req.headers['x-access-token'];
    if(!token || !token.startsWith('Bearer ')){
        res.statusCode = 401;
        res.json(FailedWithReason('Invalid token', ErrorCode.InvalidToken));
        return;
    }
    token = token.slice(7, token.length);
    verify_token(token, (err, payload)=>{
        if (err) {
            res.statusCode = 401;
            res.json(FailedWithReason('Invalid token', ErrorCode.InvalidToken));
            return;
        } else {
            ///////
            console.log(payload);
            req.token = payload;
            next();
        }
    });
}
module.exports = token_verification;