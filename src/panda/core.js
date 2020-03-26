const amqp = require('amqplib/callback_api')

const { consumer } = require('./consumer')
const { producer } = require('./producer')


amqp.connect('amqp://localhost', function (error0, connection) {

    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {

        if (error1) {
            throw error1;
        }

        console.log('ACA VAAA!')
        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);

        // Un productor que encola solicitudes
        producer(channel, queue);

        // Tres consumidores que asignan riders
        consumer(channel, queue, 'c1');
        consumer(channel, queue, 'c2');
        consumer(channel, queue, 'c3');
        // consumerUrgencia(channel, queue);

    });
});




