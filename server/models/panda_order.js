var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    discard: { type: Boolean, default: false },
    orderId: String,
    vehicle: String
});

module.exports = mongoose.model('panda_order', schema);