const express = require('express')
const app = express();


const server = require('http').createServer(app);
const io = require('socket.io')(server);

module.exports = {io};

server.listen(3000);

const path = require('path');

io.on('connection', (socket) => {
    console.log('a user conected...');

    let id = socket.id;

    console.log(id, 'ID')

    socket.on('event', payload => {
        console.log(payload,'payload')
    });


    setTimeout(() => {
        socket.emit('event', { data: 'dataaa-io', id });
    }, 1000);


});

var amqp = require('amqplib/callback_api');

// app.get('/', (req,res)=> {
//     res.json({hola:'hola campeon'})
// })
// app.use(require('./routes/hellow'));

app.use(express.static(path.resolve(__dirname, '../public')));


const EventEmitter = require('events').EventEmitter;
const riderEvent = new EventEmitter;

let hola = (msg) => {
    console.log(msg, 'HOOOLA')
}
// riderEvent.emit('rider_response', {hola:'hola campeon'});

riderEvent.on('rider_response', hola);


setTimeout(() => {
    riderEvent.emit('rider_response', { hola: 'hola campeon22' });
}, 100);

// setTimeout(() => {
//     riderEvent.on('rider_response', msg => hola(msg));

// }, 100);




amqp.connect('amqp://localhost', function (error0, connection) {

    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'hello';

        var data = {
            hola: 'hola mundooo'
        };

        let msg = JSON.stringify(data);

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        channel.sendToQueue(queue, Buffer.from(msg));
        channel.sendToQueue(queue, Buffer.from(msg));
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });

    //   setTimeout(function() { 
    //       connection.close(); 
    //       console.log('close')

    //       process.exit(0);
    //   }, 500);

});


amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.prefetch(1);


        // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        // channel.consume(queue, function (msg) {
        //     console.log(" [x] 111 hmm Received %s", msg.content.toString());

        //     setTimeout(() => {
        //         console.log('1 segundo!!');

        //         channel.ack(msg);

        //     }, 1000);


        // }, {
        //     noAck: false
        // });

        // channel.consume(queue, function (msg) {
        //     console.log(" [x] 222 Received %s", msg.content.toString());

        //     setTimeout(() => {
        //         console.log('1 segundo dooos!!');

        //         channel.ack(msg);

        //     }, 1000);

        // }, {
        //     noAck: false
        // });

        channel.consume(queue, function (msg) {
            console.log(" [x] 3333 JSON %s", JSON.parse(msg.content.toString()));

            console.log(" [x] 3333 Received %s", msg.content.toString());
        }, {
            noAck: true
        });

    });
});


// app.listen(3000, () => console.log('server is on!'));


