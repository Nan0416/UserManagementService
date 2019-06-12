
// 3rd parties library 
const mongoose = require('mongoose');

// self-defined
const queryUserByEmail = require('../db-operations/user/query_user').queryUserByEmail;

// constants and configurations
const appConfig = require('../app.config');
const mongodb_url = appConfig['mongodb-url'];



const connect = mongoose.connect(mongodb_url, { useNewUrlParser: true });
connect.then((db)=>{
        console.log("[mongodb] connected correctly to server");
        queryUserByEmail("nq_06112019_02@registeruser.com", console.log);
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
})
