var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    codigo: String,
    created: Number,
    total_riders_activos: Number,
    fecha_creacion: String,
    apiVersion: { type: String, default: '1.0.1' }
});

module.exports = mongoose.model("Actividad_rider", schema);
