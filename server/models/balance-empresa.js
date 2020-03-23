var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    deuda_empresa: { type: Number, default: 0 },
    pedidos_contador: { type: Number, default: 0 },
    usuario: String,
    codigo: String,
    fecha_inicio: String,
    fecha_termino: String,
    pagado: { type: Boolean, default: false },
    procesado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Balance_empresa', schema);