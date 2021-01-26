const AssetType = require('../models/assetType')

module.exports.insert = description => {
    var u = new AssetType()
    u.title = description;
    u.save();
    return u;
}

module.exports.list = () => AssetType.find()
module.exports.lookUp = id => AssetType.findById(id)
module.exports.lookByName = title => AssetType.findOne({title: title.toLowerCase()}).exec()

/*
module.exports.lookUpByInfos = info => User.findOne({$or:[{username: info},{email: info}]})
module.exports.edit = p => User.findByIdAndUpdate(p._id, p, {new: true}).exec()
module.exports.delete = id => User.deleteOne({_id: id}).exec()

*/

