var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    casa: {
        configurado: { type: Boolean, default: false },
        direccion: String,
        lat: Number,
        lng: Number,
        puerta: String
    },
    oficina: {
        configurado: { type: Boolean, default: false },
        direccion: String,
        lat: Number,
        lng: Number,
        puerta: String
    },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' }
});

module.exports = mongoose.model("Ubicacion", schema);
