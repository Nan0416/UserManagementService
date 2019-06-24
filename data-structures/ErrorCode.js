const ErrorCode = {
    UnknownError: -1,
    Success:0,
    EmailRegistered: 800,
    UserNotExisted: 410,
    InvalidEmailOrPassword: 402,
    InvalidClientId: 403,
    InvalidClientIdOrCredential: 405,
    InvalidClientCredential: 409,
    InvalidToken: 412,
    InvalidGrantType: 413,
    InvalidEmailFormat: 414,
    InvalidUserId: 415,
    MissingFields: 301,
    NotImplemented: 900,
};
module.exports = ErrorCode;