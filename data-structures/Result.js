const appConfig = require('../app.config');




function GetEmptyResult(){
    return {
        success: false,
        error_code: -1,
        reason: "The result is not initialized",
        value: null,
    }
}
function SuccessedWithValue(value){
    let result = GetEmptyResult();
    result.success = true;
    result.reason = null;
    result.value = value;
    result.error_code = 0;
    return result;
}

function FailedWithReason(reason, code = -1){
    let result = GetEmptyResult();
    result.success = false;
    result.reason = reason;
    result.value = null;
    return result;
}
function FailedWithReason_Dev(reason){
    if(appConfig.env.toLowerCase() === "dev"){
        return FailedWithReason(reason);
    }else{
        return FailedWithReason("Unknown");
    }
}
module.exports.GetEmptyResult = GetEmptyResult;
module.exports.SuccessedWithValue = SuccessedWithValue;
module.exports.FailedWithReason = FailedWithReason;
module.exports.FailedWithReason_Dev = FailedWithReason_Dev;
