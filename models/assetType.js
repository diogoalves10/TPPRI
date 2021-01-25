const mongoose = require('mongoose');

const AssetTypeSchema = new mongoose.Schema({
    title: {type:  String},
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('type', AssetTypeSchema);