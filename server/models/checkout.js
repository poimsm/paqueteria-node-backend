var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    created: Number,
    rider: String,
    cliente: String,
    pedido_creado: { type: Boolean, default: false },
    pedido_cancelado: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Checkout", schema);
