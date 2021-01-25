const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    prop: {type:  mongoose.ObjectId},
    type: {type:  mongoose.ObjectId},
    title: {type:  String},
    creation_time: {type: Date},
    private: {type: Boolean},
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('asset', AssetSchema);