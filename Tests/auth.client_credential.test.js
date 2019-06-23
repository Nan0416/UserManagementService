
// 3rd parties library 
const mongoose = require('mongoose');

// self-defined
const auth = require('../db-operations/auth/client_credentials_auth').auth;

// constants and configurations
const appConfig = require('../app.config');
const mongodb_url = appConfig['mongodb-url'];



const connect = mongoose.connect(mongodb_url, { useNewUrlParser: true });
connect.then((db)=>{
        console.log("[mongodb] connected correctly to server");
        auth("87a029b2-ba9f-493a-8a0e-6bf6c614c2c9", "wrjieurh3e3iu32e23e23m", console.log);
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
})