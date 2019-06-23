const token_verification = require('../routes/middleware/token_verification');

token_verification({
    headers: {
        Authentication:""
    }
}, {
    statusCode = ""
})