function GetEmptyToken(){
    return {
        user_id: null,
        client_id: null,
        grant_type: null,
    };
}

function GenerateToken(user_id, client_id, grant_type){
    let result = GetEmptyToken();
    result.user_id = user_id;
    result.client_id = client_id;
    result.grant_type = grant_type;
    return result;
}

module.exports.GenerateToken = GenerateToken;