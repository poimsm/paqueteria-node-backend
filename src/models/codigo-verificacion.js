var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    codigo: String,
    telefono: String,
    created: Number,
    usado: { type: Boolean, default: false }
});

module.exports = mongoose.model("Codigo_verificacion", schema);
