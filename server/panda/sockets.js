const { io } = require('../app')

const EventEmitter = require('events').EventEmitter
const event = new EventEmitter

const RiderState = require('../models/rider-state');
const RiderLocation = require('../models/rider-state');
const CustomerState = require('../models/customer-state');


io.on('connection', (socket) => {
    event.on('rider_state', msg => handler(msg, socket, RiderState));
    event.on('rider_location', msg => handler(msg, socket, RiderLocation));
    event.on('customer_state', msg => handler(msg, socket, CustomerState));
});

let handler = (msg, socket, db) => {
     
    if (msg.action == 'UPDATE') {
        updateDB(msg, socket, db);
    }

    if (msg.action == 'GET') {
        getDB(msg, socket, db);
    }
}

let updateDB = async (msg, socket, db) => {

    const id = msg.usuarioId;
    const body = msg.body;

    const data = await db.findOneAndUpdate({ usuario: id }, body);
    socket.emit(msg.channel, data);
}

let getDB = async (msg, socket, db) => {

    const id = msg.usuarioId;
    const data = await db.findOne({ usuario: id });
    socket.emit(msg.channel, data);
}

