// prototype only

const VALID_CLIENTS = new Map();
VALID_CLIENTS.set("269da023-c990-47f0-97b8-e1fb645a6d03", {
    "grant_type":"password"
});
VALID_CLIENTS.set("3be0cb57-29be-4362-be24-2625e51d4984", {
    "grant_type":"password"
});
VALID_CLIENTS.set("87a029b2-ba9f-493a-8a0e-6bf6c614c2c9", {
    "grant_type":"client_credentials",
    "client_secret":"wrjieurh3e3iu32e23e23m",
    "client_type":"monitor-docs",
});

function verifyClient(client_id, grant_type, options){
    if(VALID_CLIENTS.has(client_id)){
        if(VALID_CLIENTS.get(client_id)['grant_type'] === grant_type){
            switch(grant_type){
                case "password": return true;break;
                case "client_credentials": {
                    return VALID_CLIENTS.get(client_id)['client_secret'] === options['client_secret'];
                };break;
            }
        }
    }
    return false;
}
module.exports.VALID_CLIENTS = VALID_CLIENTS;
module.exports.verifyClient = verifyClient;