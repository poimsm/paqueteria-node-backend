var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider_ganancia: { type: Number, default: 0 },
    rider_deuda: { type: Number, default: 0 },
    moviapp_deuda: { type: Number, default: 0 },
    moviapp_ganancia_virtual: { type: Number, default: 0 },
    moviapp_ganancia_real: { type: Number, default: 0 },    
    total_efectivo: { type: Number, default: 0 },
    total_tarjeta: { type: Number, default: 0 },
    pedidos_contador: { type: Number, default: 0 },
    rider: String,
    codigo: String,
    fecha_inicio: String,
    fecha_termino: String,
    tipo: String,
    created: Number,
    fee: Number,
    restante: Number,
    pagado: { type: Boolean, default: false },    
    procesado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Balance_libre', schema);