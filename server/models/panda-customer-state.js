var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    ganancia: { type: Number, default: 0 },
    deuda_rider: { type: Number, default: 0 },
    deuda_moviapp: { type: Number, default: 0 },
    deuda_moviapp: { type: Number, default: 0 },
    rider: String,
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('panda_customer_state', schema);