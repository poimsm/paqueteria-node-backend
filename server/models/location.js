var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    usuario: String,
    destino: {
        direccion: String,
        lat: Number,
        lng: Number
    },
    activo: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Location', schema);