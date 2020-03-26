var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    codigo: String,
    accion: String,
    valido_hasta: String,
    tienda_tipo: String,
    valido_hasta_ms: Number,
    limite_de_usos: Number,
    usos_por_usuario: Number,
    tope: Number,
    veces_usado: { type: Number, default: 0 },
    descuento: Number,
    titulo: String,
    descripcion: String,
    tipo: String,
    vencido: { type: Boolean, default: false },
    agotado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    created: Number,
    apiVersion: { type: String, default: '1.0.1' }
});

module.exports = mongoose.model("Cupon", schema);

