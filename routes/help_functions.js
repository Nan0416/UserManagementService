function getValue(from, key){
    if(from[key] === null || from[key] === undefined){
        return null;
    }
    return from[key];
}

function hasNull(...values){
    for (let i=0; i < values.length; i++){
        if(values[i] === null){
            return true;
        }
    }
    return false;
}
module.exports.getValue = getValue;
module.exports.hasNull = hasNull;