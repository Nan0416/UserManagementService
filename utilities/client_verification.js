const valid_clients = require('../config').valid_clients;


function verify_client(client_id, grant_type, options){
    if(valid_clients.has(client_id)){
        if(valid_clients.get(client_id)['grant_type'] === grant_type){
            switch(grant_type){
                case "password": return true;
                case "client_credentials": {
                    return valid_clients.get(client_id)['client_secret'] === options['client_secret'];
                };
            }
        }
    }
    return false;
}
module.exports.verify_client = verify_client;