var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'pedido' },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    starts: Number,
    comentario: String,
    omitido: Boolean,
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Rating', schema);