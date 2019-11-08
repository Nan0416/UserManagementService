const cors = require('cors');

const whitelist = require('../config').cors_config.whitelist;

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: req.header('Origin'), credentials: true};
    }else{
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

module.exports.cors_allow_all = cors;
module.exports.cors_allow_whitelist = cors(corsOptionsDelegate);