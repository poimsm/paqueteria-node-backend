const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  img: {
    url: { type: String, default: 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1573515431/tools/l60Hf.png' },
    id: { type: String, default: '' }
  },
  nombre: String,
  telefono: String,
  tienda_tipo: String,
  email: String,
  direccion: String,
  password: String,
  relacion: String,
  vehiculo: String, 
  role: { type: String, default: 'USUARIO_ROLE' },
  stats: {
    startsSum: Number,
    startsAvg: Number,
    startsCount: Number
  },
  created: Number,
  last_login: Number,
  turno: String,
  origen: {
    direccion: String,
    lat: Number,
    lng: Number
  },
  pedidos_no_tomados: Number,
  cuentaSet: Boolean,
  notificationSet: Boolean,
  turnoSet: Boolean,
  estado_cambiado: Boolean,
  ocupado: Boolean,
  isActive: { type: Boolean, default: true }
});

schema.methods.toJSON = function () {
  let user = this;
  let userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

module.exports = mongoose.model('usuario', schema)