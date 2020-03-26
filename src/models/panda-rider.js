var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider: String,
    ciudad: String,
    vehiculo: String,
    estado: Number,
    isOnline: Boolean,
    isActive: Boolean,
    order: String,
    cliente_activo: String
});

module.exports = mongoose.model('panda_rider_state', schema);