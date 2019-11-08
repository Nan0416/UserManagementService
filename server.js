
// 3rd parties
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('morgan');
const bodyParser = require('body-parser');

// self-defined
const signupRoute = require('./router/signup');
const loginRoute = require('./router/login');

const app = express();
const server = http.createServer(app);
const server_config = require('./config').server_config;
const domain = "localhost";
////////// middleware setup ////////

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

////////// routes setup ///////////

const urlprefix = "/api/v1.0";
app.use(urlprefix + '/user/signup', signupRoute);
app.use(urlprefix + '/auth/login', loginRoute);



//////////  database setup //////////

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true);
let mongodb_url = require('./config').db_config.connection_string;

//mongoose.set('debug', true);
const connect = mongoose.connect(mongodb_url, {});
connect.then((db)=>{
    console.log("[mongodb] connected correctly to server");
    server.listen(server_config.port, server_config.domain);
    console.log(`LinuxMonitor server is running at http://${server_config.domain}:${server_config.port}`);
}, (err)=>{
    console.log("[mongodb] connection failed")
    console.log(err);
});

