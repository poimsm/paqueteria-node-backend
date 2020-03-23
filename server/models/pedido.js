var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    origin: {
        lat: Number,
        lng: Number,
        address: String
    },
    destination: {
        lat: Number,
        lng: Number,
        address: String
    },
    trip_promo_price: Number,
    trip_price: Number,
    ranting: { type: mongoose.Schema.Types.ObjectId, ref: 'ranting' },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
    distance: Number,
    payment_method: String,
    receiver_signature: {
        url: String,
        id: String
    },
    balance: String,
    origin_phone: String,
    origin_name: String,
    destination_name: String,
    destination_phone: String,
    instructions: String,
    entrega_estimada: String,
    type: String,
    product_price: Number,
    product_description: String,
    delivery_time: String,
    created_order_date: String,
    from: String,
    created: Number,
    acceso_web: Boolean,
    pago_posterior: Boolean,
    envio_pagado: Boolean,
    pagar_productos: Boolean,
    cobrar_productos: Boolean,
    proximo: { type: Boolean, default: false },
    entregado: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    is: { type: Boolean, default: true },
    modificado_por_admin: Boolean,
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Order', schema);