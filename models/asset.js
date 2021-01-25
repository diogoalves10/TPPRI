const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    prop: {type:  mongoose.ObjectId},
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('asset', AssetSchema);