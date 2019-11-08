
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
const port = 5010;
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
mongodb_url = "mongodb://localhost:27017/cs6400_project";

//mongoose.set('debug', true);
const connect = mongoose.connect(mongodb_url, {});
connect.then((db)=>{
    console.log("[mongodb] connected correctly to server");
    server.listen(port, domain);
    console.log(`LinuxMonitor server is running at http://${domain}:${port}`);
}, (err)=>{
    console.log("[mongodb] connection failed")
    console.log(err);
});

