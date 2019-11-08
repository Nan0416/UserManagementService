const valid_clients = new Map();

valid_clients.set("269da023-c990-47f0-97b8-e1fb645a6d03", {
    "grant_type":"password"
});
valid_clients.set("3be0cb57-29be-4362-be24-2625e51d4984", {
    "grant_type":"password"
});
valid_clients.set("87a029b2-ba9f-493a-8a0e-6bf6c614c2c9", {
    "grant_type":"client_credentials",
    "client_secret":"wrjieurh3e3iu32e23e23m",
    "client_type":"monitor-docs",
});
module.exports.valid_clients = valid_clients;


module.exports.server_config = {
    domain: "localhost",
    port: 5010
};


module.exports.db_config = {
    connection_string: "mongodb://localhost:27017/cs6400_project"
};

module.exports.secret_config = {
    salt_rounds: 10,
    password_reset_secret_valid_duration: 30 * 60, // seconds;
};

module.exports.cors_config = {
    whitelist: [],
};

module.exports.token_config = {
    token_key: "jroewifjoewf213mowief0",
    token_duration: "1h",
    public_key: "wewjow324jdie"
};