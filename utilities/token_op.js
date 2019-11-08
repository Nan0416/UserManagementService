// 3rd-party libraries
const jwt=require('jsonwebtoken');

const token_key = "jroewifjoewf213mowief0";
const token_duration = "1h"
const public_key = "wewjow324jdie"

function generate_token(data, callback){
    data._public = public_key;
    let token = jwt.sign(data, token_key,{expiresIn: token_duration});
    if(callback == null){
        return token;
    }else{
        callback(null, token);
    }
}

function verify_token(token, callback){
    jwt.verify(token, token_key, (err, data)=>{
        if(err != null){
            callback(err);
        }else if(data != null && data._public == public_key){
            callback(data);
        }else{
            callback(new Error("Invalid token."));
        }
    });
}

module.exports.generate_token = generate_token;
module.exports.verify_token = verify_token;