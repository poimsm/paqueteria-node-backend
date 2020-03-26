const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter;

const PandaPedido = require('../models/panda-pedido');

const _solicitud = require('./services/solicitud');


let consumer = (channel, queue, consumer) => {

    channel.consume(queue, async (msg) => {

        let message = JSON.parse(msg.content.toString())

        let pedido = await obtener_pedido(message.pedido);

        if (pedido.descartar)
            return channel.ack(msg);

        let solicitud = {};

        let tries = 0;

        while (tries <= 3) {
            solicitud = await enviar_solicitud_a_riders(message, consumer);
            solicitud.ok ? tries = 4 : tries++;
        }

        if (solicitud.ok)
            return channel.ack(msg);


        await error_solicitud_handler(solicitud, channel)
        channel.ack(msg)


    }, { noAck: false });
}


let obtener_pedido = (id) => {
    return PandaPedido.findOne({ pedido: id });
}


let enviar_solicitud_a_riders = (msg, consumer) => {

    let query = {
        ciudad: 'santiago',
        vehiculo: 'moto',
        lat: msg.origen.lat,
        lng: msg.origen.lng
    };

    return _solicitud.searchRider(query, consumer);
}


let error_solicitud_handler = (request, channel) => {

    event.on(``, userJoined);


    setTimeout(() => {


    }, 1000 * 45);

}

let requestHandler = () => {

}


module.exports = { consumer }