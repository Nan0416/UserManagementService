
// 3rd parties library 
const mongoose = require('mongoose');

// self-defined
const auth = require('../db-operations/auth/password_auth').auth;

// constants and configurations
const appConfig = require('../app.config');
const mongodb_url = appConfig['mongodb-url'];



const connect = mongoose.connect(mongodb_url, { useNewUrlParser: true });
connect.then((db)=>{
        console.log("[mongodb] connected correctly to server");
        auth("nq_06112019_02@registeruser.com", "QN1994qn", console.log);
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
})