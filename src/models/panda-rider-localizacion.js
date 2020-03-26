var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    estado: Number,
    isActive: Boolean,
    isOnline: Boolean,
    rider: String,
    lat: Number,
    lng: Number,
    vehiculo: String
});

module.exports = mongoose.model('panda_rider_localizacion', schema);