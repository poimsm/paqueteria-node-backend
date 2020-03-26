var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider: String,
    balance: String,
    fecha: String,
    monto: Number,
    created: Number,
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Pago', schema);