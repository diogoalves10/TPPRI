const Asset = require('../models/asset')

module.exports.insert = (user, asset) => {
    var u = new Asset(asset)
    u.prop = user.id;
    u.save();
    return u;
}

/*
module.exports.list = () => User.find()
module.exports.lookUp = id => User.findById(id)
module.exports.lookUpByInfos = info => User.findOne({$or:[{username: info},{email: info}]})
module.exports.edit = p => User.findByIdAndUpdate(p._id, p, {new: true}).exec()
module.exports.delete = id => User.deleteOne({_id: id}).exec()

*/

