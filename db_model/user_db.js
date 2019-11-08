const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String, 
        required: true,
        unique: true,
    },
    hash_password:{
        type: String,
        required: true,
    },
    status:{
        type: Number,
        default: 1,
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,
    usePushEach:true
});

const user = mongoose.model("users", User);
module.exports = user;