const User = require('../models/user')

module.exports.insert = u => new User(u).save()
module.exports.list = () => User.find().exec()
module.exports.lookUp = id => User.findById(id).exec()
module.exports.lookUpByInfos = info => User.findOne({$or:[{username: info},{email: info}]}).exec()
module.exports.edit = (id, p) => User.findByIdAndUpdate(id, p, {new: true})
module.exports.delete = id => User.deleteOne({_id: id}).exec()
