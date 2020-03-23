var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider: String,
    city: String,
    vehicle: String,
    state: Number,
    isOnline: Boolean,
    isActive: Boolean,
    order: String,
    customer: String,
    activeId: String
});

module.exports = mongoose.model('panda_rider_state', schema);