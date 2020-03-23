const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter;


let consumer = (channel, queue) => {

    channel.consume(queue, async (msg) => {

        let message = JSON.parse(msg.content.toString())

        let discardOrder = await getOrderState(message.orderId);
       
        if (discardOrder)
            return channel.ack(msg);

        let request = await sendRequestToRider(message);

        if (request.success)
            return channel.ack(msg);

        await failRequestHandler(request, channel)
        channel.ack(msg)


    }, { noAck: false });
}


let getOrderState = (id) => {

    event.on('rider_response', userJoined);


    setTimeout(() => {


    }, 1000 * 45);

}



let failRequestHandler = (request, channel) => {

    event.on('rider_response', userJoined);


    setTimeout(() => {


    }, 1000 * 45);

}




let sendRequestToRider = (msg) => {

    event.on('rider_response', userJoined);


    setTimeout(() => {


    }, 1000 * 45);

}

let requestHandler = () => {

}


module.exports = { consumer }