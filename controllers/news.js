const New = require('../models/new')

module.exports.insert = u => {
    var u = new New(u)
    u.save();
    return u;
}
module.exports.list = () => New.find()
