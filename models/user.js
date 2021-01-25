const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String , required:true, index: true, unique:true},
    email: {type: String , required:true, index: true, unique:true},
    hash: {type: String, required:true},
    level: {type: Number, required:true},
    description: {type: String},
    image: {
        date: {type: Date},
        originalName: {type: String},
        mimetype: {type: String},
        size: {type: Number},
        url: {type: String, default: '/images/default.jpg'}
    },
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('user', UserSchema);