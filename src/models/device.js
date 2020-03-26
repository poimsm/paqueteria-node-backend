var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    created: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    token: String
});

module.exports = mongoose.model('Device', schema);