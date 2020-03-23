var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    cupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Cupon' },
    usos: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    created: Number
});

module.exports = mongoose.model("Cupon_usuario", schema);
