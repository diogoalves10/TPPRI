const User = require('../models/user')

module.exports.insert = u => {
    var u = new User(u)
    u.save();
    return u;
}
module.exports.list = () => User.find()
module.exports.lookUp = id => User.findById(id)
module.exports.lookUpByInfos = info => User.findOne({$or:[{username: info},{email: info}]})
module.exports.edit = (id, p) => User.findByIdAndUpdate(id, p, {new: true})
module.exports.delete = id => User.deleteOne({_id: id})
