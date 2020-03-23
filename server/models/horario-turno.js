var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider: String,
    inicio: String,
    termino: String,
    created: Number,
    inicio_activo: { type: Boolean, default: false },
    termino_activo: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Horario_turno', schema);