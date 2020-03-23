var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'pedido' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    starts: Number,
    comment: String,
    omitted: Boolean,
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Rating', schema);