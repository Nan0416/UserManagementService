const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordReset = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    secret:{ // don't be guessable.
        type: String,
        required: true,
        unique: true
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,
    usePushEach:true
});
PasswordReset.index({secret: 1});
const password_reset = mongoose.model("password_reset", PasswordReset);
module.exports = password_reset;