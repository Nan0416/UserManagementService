
// 3rd parties
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const logger = require('morgan');
const bodyParser = require('body-parser');

// self-defined
const signupRoute = require('./routes/user/signup');
const loginRoute = require('./routes/auth/login');
const queryUserRouter = require('./routes/user/query');
// config
const appConfig = require('./app.config');


const app = express();
const server = http.createServer(app);
////////// middleware setup ////////

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

////////// routes setup ///////////

const urlprefix = appConfig['urlprefix'];
app.use(urlprefix + '/user/signup', signupRoute);
app.use(urlprefix + '/auth/login', loginRoute);

app.use(urlprefix + '/user/query', queryUserRouter);



//////////  database setup //////////

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true);
//mongoose.set('debug', true);
const connect = mongoose.connect(appConfig['mongodb-url'], {
});
connect.then((db)=>{
    console.log("[mongodb] connected correctly to server");
    server.listen(appConfig['port'], appConfig['addr']);
    console.log(`LinuxMonitor server is running at http://${ appConfig['addr']}:${appConfig['port']}`);
}, (err)=>{
    console.log("[mongodb] connection failed")
    console.log(err);
});

