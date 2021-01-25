const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    description: {type: String},
    reg_time: {type: Date, default: Date.now}
}, {
    versionKey: false
});

module.exports = mongoose.model('pedido', PedidoSchema);