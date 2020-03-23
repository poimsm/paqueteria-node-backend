var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
    actividad_id: String,
    apiVersion: { type: String, default: '1.0.1' }
});

module.exports = mongoose.model("Dato", schema);
