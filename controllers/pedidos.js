const Pedido = require('../models/pedido')

module.exports.insert = o => {
    Pedido.findById(o._id).then(oalready => {
        if(oalready)
            Pedido.deleteOne({_id: oalready._id}).then(uu => {
                var u = new Pedido(o)
                u.save();
                return u;
            })
        else{
            var u = new Pedido(o)
            u.save();
            return u;
        }
    })
}
module.exports.list = () => Pedido.find()
module.exports.lookUp = id => Pedido.findById(id)
module.exports.delete = id => Pedido.deleteOne({_id: id}).exec()
