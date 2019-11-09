
const email_config = require('../config').email_config;
const mailgun = require('mailgun-js')({apiKey: email_config.private_api_key, domain: email_config.domain});

function send_email(recipient_addr, email, callback){
    const data = {
        from: 'support <support@qinnan.dev>',
        to: recipient_addr,
        subject: email.subject,
        text: email.body
    };
    mailgun.messages().send(data, (err, body) => {
        console.log(err, body);
        if(err != null){
            err.message = "email service error";
            err.statusCode = 500;
        }
        callback(err, body);
    });
}
module.exports.send_email = send_email;


/*const data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'foo@example.com, bar@example.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};*/

