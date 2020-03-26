var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    pago_exitoso: { type: Boolean, default: false },
    created: Number,
    monto: Number,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    tipo_de_pasarela:  { type: String, default: 'flow' },
    flow: Object,
    flowOrder: Number
});

module.exports = mongoose.model("Transaccion_bancaria", schema);
