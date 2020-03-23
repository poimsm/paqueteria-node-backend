const moment = require('moment');
moment.locale('es');

const messages = require('../../utils/messages');

const Pedido = require('../../models/panda_rider_location');
const Usuario = require('../../models/panda_rider_state');
const Rating = require('../../models/panda_customer_state');
const Device = require('../../models/panda_orders');


module.exports = {

    createOrder: async (req, res, next) => {
        const body = req.body;

        foundDevice = await Device.findOne({ usuario: body.usuario });

        if (foundDevice) {
            if (body.token == foundDevice.token) {
                res.status(200).json();
            } else {
                body.created = new Date().getTime();
                await Device.findByIdAndUpdate(foundDevice._id, body);
                res.status(200).json();
            }
        } else {

            body.created = new Date().getTime();
            await Device.create(body);
            res.status(200).json();
        }
    },

    getQueue: async (req, res, next) => {
        const id = req.query.id;
        const data = await Device.findOne({ usuario: id });
        res.status(200).json(data);
    },

    getOrders: async (req, res, next) => {
        const body = req.body;
        const id = req.query.id;

        await Usuario.findByIdAndUpdate(body.rider, { ocupado: false });

        let img = {};

        if (body.img64) {
            img = await uploader(body.img64);
        }

        const rating = await Rating.findOne({ cliente: body.cliente });

        if (!rating) {
            await Rating.create({
                pedido: id,
                cliente: body.cliente,
                rider: body.rider
            });
        }

        const pedidoData = {
            entregado: true,
            activo: false,
            firma_del_receptor: img,
            rating: rating._id
        };

        await Pedido.findByIdAndUpdate(id, pedidoData);

        res.status(200).json({});
    },

    updateOrder: async (req, res, next) => {
        const id = req.query.id;
        const pedidos = await Pedido.find({ rider: id }).populate('cliente rider rating').sort({ created: -1 });
        res.status(200).json(pedidos);
    },

    createRiderState: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;
        const data = await Pedido.findByIdAndUpdate(id, body);
        res.status(200).json(data);
    },

    updateRiderState: async (req, res, next) => {
        const body = req.body;
        await Pedido.findByIdAndUpdate(body.pedido, { cancelado: true, activo: false });
        await Usuario.findByIdAndUpdate(body.rider, { ocupado: false });
        res.status(200).json({});
    },

    createRiderLocation: async (req, res, next) => {
        const body = req.body;

        await Checkout.findByIdAndUpdate(body.checkout, { pedido_creado: true });
        await Usuario.findByIdAndUpdate(body.rider, { ocupado: true });
        await Location.findOneAndUpdate({ usuario: body.cliente }, { activo: false });

        body.created = new Date().getTime();

        const min = body.tiempo_entrega;

        body.entrega_estimada = moment(body.created + min * 60 * 1000).tz("America/Santiago").format('H:mm');
        body.fecha_creacion = moment().tz("America/Santiago").format('DD MMM h:mm A');

        const pedido = await Pedido.create(body);
        res.status(200).json(pedido);
    },

    updateRiderLocation: async (req, res, next) => {
        const id = req.query.id;

        const ratings = await Rating.find({ cliente: id, isActive: true }).populate('rider');

        if (ratings.length == 0) {
            return res.status(200).json({ ok: false });
        }

        res.status(200).json({ ok: true, rating: ratings[0] });
    },

    createCustomerState: async (req, res, next) => {

        const body = req.body;
        const riderId = req.query.rider;
        const rateId = req.query.rate;

        if (body.omitido) {
            await Rating.findByIdAndUpdate(rateId, body);
            return res.status(200).json();
        }

        const rider = await Usuario.findById(riderId);

        rider.stats.startsSum += body.starts;
        rider.stats.startsCount += 1;

        let a = Math.round((rider.stats.startsSum / rider.stats.startsCount) * 10) / 10;
        let b = Math.floor(a);
        a - b <= 0.5 ? b += 0.5 : b += 1;
        rider.stats.startsAvg = b;

        await Usuario.findByIdAndUpdate(riderId, rider);
        await Rating.findByIdAndUpdate(rateId, body);

        res.status(200).json({});
    },

    updateCustomerState: async (req, res, next) => {
        const id = req.query.id;
        // const tipo = req.query.tipo;
        // let pedidos = [];

        pedidos = await Pedido.find({ cliente: id }).populate('rider').sort({ created: -1 }).limit(10);


        // if (tipo == 'proximos') {
        //     pedidos = await Pedido.find({ cliente: id, activo: true }).populate('rider').sort({ created: -1 }).limit(15);
        // }

        // if (tipo == 'completados') {
        //     pedidos = await Pedido.find({ cliente: id, activo: false }).populate('rider').sort({ created: -1 }).limit(15);
        // }

        res.status(200).json(pedidos);
    }
}