

function token_verification(req, res, next){
    let token = req.headers['authorization'] || req.headers['x-access-token'];
    if(!token || !token.startsWith('Bearer ')){
        res.statusCode = 401;
        res.json({"success": false, reason: "Invalid token."});
    }else{
        token = token.slice(7, token.length);
        verify_token(token, (err, payload)=>{
            if (err) {
                res.statusCode = 401;
                res.json({"success":false, reason: err.message});
            } else {
                res.token_data = payload;
                next();
            }
        });
    }
}
module.exports = token_verification;