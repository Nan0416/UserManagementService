const appConfig = require('../app.config');
const ErrorCode = require('./ErrorCode');



function GetEmptyResult(){
    return {
        success: false,
        error_code: ErrorCode.UnknownError,
        reason: "The result is not initialized",
        value: null,
    }
}
function SuccessedWithValue(value, token = null){
    let result = GetEmptyResult();
    result.success = true;
    result.reason = null;
    result.value = value;
    result.error_code = ErrorCode.Success;
    if(token != null){
        result.token = token;
    }
    return result;
}

function FailedWithReason(reason, code = ErrorCode.UnknownError){
    let result = GetEmptyResult();
    result.success = false;
    result.reason = reason;
    result.value = null;
    result.error_code = code;
    return result;
}
function FailedWithReason_Dev(reason, code = ErrorCode.UnknownError){
    if(appConfig.env.toLowerCase() === "dev"){
        return FailedWithReason(reason, code);
    }else{
        return FailedWithReason("Unknown", ErrorCode.UnknownError);
    }
}
module.exports.GetEmptyResult = GetEmptyResult;
module.exports.SuccessedWithValue = SuccessedWithValue;
module.exports.FailedWithReason = FailedWithReason;
module.exports.FailedWithReason_Dev = FailedWithReason_Dev;
