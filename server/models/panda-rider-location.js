var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    state: Number,
    isActive: Boolean,
    isOnline: Boolean,
    rider: String,
    lat: Number,
    lng: Number,
    vehicle: String
});

module.exports = mongoose.model('panda_rider_location', schema);