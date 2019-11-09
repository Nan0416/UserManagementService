
const email_config = require('../config').email_config;
const mailgun = require('mailgun-js')({apiKey: email_config.private_api_key, domain: email_config.domain});

function send_email(recipient_addr, email, callback){
    const data = {
        from: 'support <support@qinnan.dev>',
        to: recipient_addr,
        cc: 'nqin8@gatech.edu',
        subject: email.subject,
        html: email.amp_html
    };
    mailgun.messages().send(data, (err, body) => {
        if(err != null){
            err.message = "email service error";
            err.statusCode = 500;
        }
        callback(err, body);
    });
}

function generate_forget_password_amp_html(url){
    return `
    <!doctype html>
    <html ⚡4email>
    <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-custom>
        h1 {
        margin: 1rem;
        }
    </style>
    </head>
    <body>
        <p>${url}</p>
    </body>
    </html>
    `
}

module.exports.send_email = send_email;
module.exports.generate_forget_password_amp_html = generate_forget_password_amp_html;


/*const data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'foo@example.com, bar@example.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};*/

