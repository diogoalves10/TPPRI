
const New = require('../models/new')

module.exports.insert = u => {
    var u = new New(u)
    u.save();
    return u;
}
module.exports.deleteUser = id => {
    New.deleteMany({id:id}).exec()
}

module.exports.list = () => New.find().sort({reg_time: -1}).limit(10)
