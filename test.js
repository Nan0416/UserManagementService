
// 3rd parties
const mongoose = require('mongoose');
const bluebird = require('bluebird');

const reset_password_test = require('./db_op_test/reset_password').reset_password_test;
const reset_password_generate_secret_test = require('./db_op_test/reset_password').reset_password_generate_secret_test;
const reset_password_with_secret_test = require('./db_op_test/reset_password').reset_password_with_secret_test;
mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true);
mongodb_url = "mongodb://localhost:27017/cs6400_project";



//mongoose.set('debug', true);
const connect = mongoose.connect(mongodb_url, {});
connect.then((db)=>{
    console.log("[mongodb] connected correctly to server");
    // reset_password_test();
    // reset_password_generate_secret_test();
    reset_password_with_secret_test();
}, (err)=>{
    console.log("[mongodb] connection failed")
    console.log(err);
});

