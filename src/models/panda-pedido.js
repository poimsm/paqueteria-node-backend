var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    descartar: { type: Boolean, default: false },
    origen: {
        lat: Number,
        lng: Number
    },
    pedido: String,
    vehiculo: String
});

module.exports = mongoose.model('panda_pedido', schema);