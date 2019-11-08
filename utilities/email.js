
function send_email(recipient_addr, email, callback){
    let new_err = new Error("not implement");
    new_err.statusCode = 501;
    callback(new_err);
}
module.exports.send_email = send_email;