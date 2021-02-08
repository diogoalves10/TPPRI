const mongoose = require('mongoose');

const NewSchema = new mongoose.Schema({
    prop: {type:  mongoose.ObjectId},
    asset: {type:  mongoose.ObjectId},
    prod:{type: Boolean},
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('new', NewSchema);