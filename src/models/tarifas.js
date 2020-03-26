var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    dia: {
        moto: {
            distancia: Number,
            minima: Number,
            base: Number,
            limite: Number,
            maxLimite: Number,
        },
        bici: {
            distancia: Number,
            minima: Number,
            base: Number,
            limite: Number,
            maxLimite: Number,
        }
    },
    noche: {
        moto: {
            distancia: Number,
            minima: Number,
            base: Number,
            limite: Number,
            maxLimite: Number,
        },
        bici: {
            distancia: Number,
            minima: Number,
            base: Number,
            limite: Number,
            maxLimite: Number,
        }
    },
    horaCambioNoche: Number,
    horaCambioDia: Number
});

module.exports = mongoose.model('Tarifa', schema);