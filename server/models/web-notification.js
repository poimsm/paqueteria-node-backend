var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    created: Number,
    usuario: String,
    subscription: Object,
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Web_notification', schema);