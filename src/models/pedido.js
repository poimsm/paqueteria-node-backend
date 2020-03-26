var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    origen: {
        lat: Number,
        lng: Number,
        direccion: String,
        puerta: String
    },
    destino: {
        lat: Number,
        lng: Number,
        direccion: String,
        puerta: String
    },
    costo: Number,
    costo_real: Number,
    ranting: { type: mongoose.Schema.Types.ObjectId, ref: 'ranting' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    distancia: Number,
    metodo_de_pago: String,
    firma_del_receptor: {
        url: String,
        id: String
    },
    balance: String,
    telefono_origen: String,
    telefono_destino: String,
    nombre_origen: String,
    nombre_destino: String,
    instrucciones: String,
    entrega_estimada: String,
    tipo: String,
    precio_producto: Number,
    descripcion_producto: String,
    tiempo_entrega: String,
    fecha_creacion: String,
    from: String,
    created: Number,
    acceso_web: Boolean,
    pago_posterior: Boolean,
    envio_pagado: Boolean,
    pagar_productos: Boolean,
    cobrar_productos: Boolean,
    proximo: { type: Boolean, default: false },
    entregado: { type: Boolean, default: false },
    cancelado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    modificado_por_admin: Boolean,
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Pedido', schema);