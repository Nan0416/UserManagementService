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