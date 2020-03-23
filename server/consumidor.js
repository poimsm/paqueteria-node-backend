const amqp = require('amqplib/callback_api')
const { io } = require('app')

const EventEmitter = require('events').EventEmitter;
const riderEvent = new EventEmitter;

let consumidor = (channel, queue) => {

    channel.consume(queue, async (msg) => {


        let message = JSON.parse(msg.content.toString());

        let successfulRequest = await resquestSender(message);

        if (successfulRequest)
            return channel.ack(msg);



        setTimeout(() => {
            console.log('1 segundo!!');

            channel.ack(msg);

        }, 1000);

        // riderEvent.on('rider_response', userJoined);



    }, { noAck: false });

}





let requestSender = (msg) => {

    setTimeout(() => {

        riderEvent.on('rider_response', userJoined);

        io.on('connection', (socket) => {
            console.log('a user conected...');
        
            socket.emit('event', { data: 'dataaa' });
        
            riderEvent.on('rider_response', hola);
        
            socket.id
        });

    }, 1000 * 45);

}

let requestHandler = () => {

}


amqp.connect('amqp://localhost', function (error0, connection) {

    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {

        if (error1) {
            throw error1;
        }

        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.prefetch(1);


        consumidor();

    });
});




