const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    prop: {type:  mongoose.ObjectId},
    type: {type:  mongoose.ObjectId},
    title: {type:  String},
    descricao: {type:  String},
    creation_time: {type: Date},
    private: {type: Boolean},
    tags:{type: [String]},
    files:{type: [String]},
    link:{type: String},
    stars: {type:
        [{
            user: {type:  mongoose.ObjectId},
            stars: {type: Number}
        }]
    },
    comments: {type:
            [{
                reg_time: {type: Date},
                user: {type:  mongoose.ObjectId},
                comment: {type: String}
            }]
    },
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('asset', AssetSchema);