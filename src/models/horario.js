var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    rider: String,
    horas: [{
        _id: false,
        miliseconds: Number,
        isActive: Boolean,
        isEnd: Boolean
    }],
    dias: {
        fecha: String,
        horas: [{
            _id: false,
            hora: String,
            isActive: Boolean
        }]
    },
    created: Number,
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Horario', schema);