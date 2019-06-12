const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserStatusType = require('./user_status_types');
const User = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    hash_password:{
        type: String,
        required: true,
    },
    first_name:{
        type: String,
        required: false,
    },
    last_name:{
        type: String,
        required: false,
    },
    type:{
        type: Number, 
        default: 1
    },
    // profile url
    profile:{
        type: String,
        required: false,
    },
    // 0 registered, 1 email verified
    status:{
        type: Number,
        default: UserStatusType.AccountRegistered
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,
    usePushEach:true
});
User.index({email: 1});

const user = mongoose.model("user", User);
module.exports = user;