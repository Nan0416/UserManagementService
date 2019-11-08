const reset_password = require('../db_op/user_op').reset_password;
const reset_password_generate_secret = require('../db_op/user_op').reset_password_generate_secret;
const reset_password_with_secret = require('../db_op/user_op').reset_password_with_secret;

const bcrypt = require('bcrypt');
function reset_password_test(){
    reset_password({username: "nq_11072019_05@route.com"}, "new-pass", (err, user)=>{
        bcrypt.compare("new-pass", user.hash_password, (err, result)=>{
            if(result){
                console.log("done");
            }
        });
    });
}

function reset_password_generate_secret_test(){
    reset_password_generate_secret({username: "nq_11072019_05@route.com"}, console.log);
}
function reset_password_with_secret_test(){
    reset_password_with_secret("JDJiJDEwJDlqR3QvODkxS2dMWkJqYVNHcVBWYk9rRDBtOUVOS3J1c1Y2ZUVzT1ZCaUtheTRVbnlqLmZp", "12345", console.log);
}
module.exports.reset_password_test = reset_password_test;
module.exports.reset_password_generate_secret_test = reset_password_generate_secret_test;
module.exports.reset_password_with_secret_test = reset_password_with_secret_test;