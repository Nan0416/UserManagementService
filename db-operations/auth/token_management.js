
// 3rd-party libraries
const jwt=require('jsonwebtoken');

const GenerateToken = require('../../data-structures/Token').GenerateToken;
// config
const config = require('../../app.config');
const ErrorCode = require('../../data-structures/ErrorCode');
// generate a token
// verify a token
/*{
    userid:
    clientid:
}*/
function generate_token(userId, clientId, grantType){
    return token=jwt.sign(
        GenerateToken(
            userId,
            clientId,
            grantType
        ),
        config['token-key'],
        {
            expiresIn: config['token-duration']
        });
}

function verify_token(token, callback){
    jwt.verify(token, config['token-key'], callback);
}

module.exports.generate_token = generate_token;
module.exports.verify_token = verify_token;