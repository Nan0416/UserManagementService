
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
        auth("3be0cb57-29be-4362-be24-2625e51d4984", "nq_06112019_02@registeruser.com", "@uthPassword!", console.log);
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
})