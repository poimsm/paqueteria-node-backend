const cloudinary = require("cloudinary");
const moment = require('moment');
moment.locale('es');

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyA776HW8RB4Vckeqc82BI7taQtF2O5iZn8',
    formatter: null
};

const geocoder = NodeGeocoder(options);

const messages = require('../../utils/messages');

const Pedido = require('../../models/pedido');
const Usuario = require('../../models/usuario');
const Rating = require('../../models/rating');
const Device = require('../../models/device');
const Cupon = require('../../models/cupon');
const CuponUsuario = require('../../models/cupon-usuario');
const Ubicacion = require('../../models/ubicacion');
const Tarifas = require('../../models/tarifas');
const Checkout = require('../../models/checkout');
const Balance = require('../../models/rider-balance');
const BalanceLibre = require('../../models/balance-libre');
const BalanceTurno = require('../../models/balance-turno');
const Pago = require('../../models/pago');
const Horario = require('../../models/horario');
const BalanceEmpresa = require('../../models/balance-empresa');
const Location = require('../../models/location');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let uploader = (img64) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(img64, function (result) {
            const image = {
                url: result.url,
                id: result.public_id
            };
            resolve(image);
        });
    })
};

let setHorario = () => {
    const fecha_dias = moment().tz("America/Santiago").format('DD-MM-YYYY');
    const time_string_temp1 = moment(fecha_dias, 'DD-MM-YYYY').tz("America/Santiago").format('x');
    const miliseconds_start = Number(time_string_temp1);
    const miliseconds_end = Number(time_string_temp1) + 24 * 60 * 60 * 1000;

    const fecha_dia_1 = moment(miliseconds_start).tz("America/Santiago").format('dddd DD MMMM YYYY');
    const fecha_dia_2 = moment(miliseconds_end).tz("America/Santiago").format('dddd DD MMMM YYYY');

    const fecha_horas = moment().tz("America/Santiago").format('DD-MM-YYYY H A');
    const time_string_temp2 = moment(fecha_horas, 'DD-MM-YYYY H A').tz("America/Santiago").format('x');
    let miliseconds = Number(time_string_temp2) + 60 * 60 * 1000;

    const horario = [
        {
            fecha: fecha_dia_1,
            horas: []
        },
        {
            fecha: fecha_dia_2,
            horas: []
        }
    ];

    let cambio_fecha = false;

    for (let i = 0; i <= 15; i++) {

        const hora_inicio = moment(miliseconds).tz("America/Santiago").format('H');

        miliseconds += 60 * 60 * 1000;

        const hora_fin = moment(miliseconds).tz("America/Santiago").format('H');

        const data = {
            miliseconds: miliseconds - 60 * 60 * 1000,
            hora: `${hora_inicio}:00 - ${hora_fin}:00`,
            isActive: false
        };

        if (!cambio_fecha) {
            horario[0].horas.push(data);
        } else {
            horario[1].horas.push(data);
        }

        if (hora_fin == 0) {
            cambio_fecha = true;
        }
    };

    if (horario[1].horas.length == 0) {
        horario.splice(1, 1);
    }

    return horario;
}

module.exports = {

    deviceUpadete: async (req, res, next) => {
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

    deviceGetOne: async (req, res, next) => {
        const id = req.query.id;
        const data = await Device.findOne({ usuario: id });
        res.status(200).json(data);
    },

    proofOfDelivery: async (req, res, next) => {
        const body = req.body;
        const id = req.query.id;

        await Usuario.findByIdAndUpdate(body.rider, { ocupado: false });

        let img = {};

        if (body.img64) {
            img = await uploader(body.img64);
        }

        if (body.tipo == 'USUARIO_ROLE') {

            const rating = await Rating.create({
                pedido: id,
                cliente: body.cliente,
                rider: body.rider
            });

            const pedidoData = {
                balance: body.balance,
                entregado: true,
                activo: false,
                firma_del_receptor: img,
                rating: rating._id
            };

            await Pedido.findByIdAndUpdate(id, pedidoData);

            return res.status(200).json({});
        }

        const rating_existe = await Rating.findOne({ cliente: body.cliente });

        if (!rating_existe && body.tipo == 'EMPRESA_ROLE') {

            const rating = await Rating.create({
                pedido: id,
                cliente: body.cliente,
                rider: body.rider
            });

            const pedidoData = {
                balance: body.balance,
                entregado: true,
                activo: false,
                firma_del_receptor: img,
                rating: rating._id
            };

            await Pedido.findByIdAndUpdate(id, pedidoData);
            res.status(200).json({});
        }

        if (rating_existe && body.tipo == 'EMPRESA_ROLE') {

            const pedidoData = {
                entregado: true,
                activo: false,
                firma_del_receptor: img
            };

            await Pedido.findByIdAndUpdate(id, pedidoData);
            res.status(200).json({});
        }
    },

    pedidoConfirm: async (req, res, next) => {
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

    getPedidosByRiderId: async (req, res, next) => {
        const id = req.query.id;
        const pedidos = await Pedido.find({ rider: id }).populate('cliente rider rating').sort({ created: -1 });
        res.status(200).json(pedidos);
    },

    updatePedido: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;
        const data = await Pedido.findByIdAndUpdate(id, body);
        res.status(200).json(data);
    },

    cancelarPedido: async (req, res, next) => {
        const body = req.body;
        await Pedido.findByIdAndUpdate(body.pedido, { cancelado: true, activo: false });
        await Usuario.findByIdAndUpdate(body.rider, { ocupado: false });
        res.status(200).json({});
    },

    crearPedido: async (req, res, next) => {
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

    getActiveRating: async (req, res, next) => {
        const id = req.query.id;

        const ratings = await Rating.find({ cliente: id, isActive: true }).populate('rider');

        if (ratings.length == 0) {
            return res.status(200).json({ ok: false });
        }

        res.status(200).json({ ok: true, rating: ratings[0] });
    },

    clientUpdateRating: async (req, res, next) => {

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

    getPedidosByClientId: async (req, res, next) => {
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
    },

    getPedidoActivo: async (req, res, next) => {
        const id = req.query.id;
        const pedidos = await Pedido.find({ cliente: id, activo: true }).populate('rider').sort({ created: -1 }).limit(1);
        const pedido = pedidos[0];

        if (pedidos.length == 0) {
            return res.status(200).json({ ok: false });
        }

        res.status(200).json({ ok: true, pedido });
    },

    getOnePedido: async (req, res, next) => {
        const id = req.query.id;
        const pedido = await Pedido.findById(id).populate('cliente rider');
        res.status(200).json({ ok: true, pedido });
    },

    getOneUser: async (req, res, next) => {
        const id = req.query.id;
        const rider = await Usuario.findById(id);
        res.status(200).json(rider);
    },

    getCoupons: async (req, res, next) => {
        const id = req.query.id;
        const cupones = await CuponUsuario.find({ usuario: id, usado: false }).sort({ created: -1 }).populate('cupon');
        res.status(200).json({ ok: true, cupones });
    },

    getActiveCoupon: async (req, res, next) => {
        const id = req.query.id;

        const mis_cupones = await CuponUsuario.find({ usuario: id, isActive: true });

        if (mis_cupones.length == 0) {
            return res.status(200).json({ ok: false });
        }

        const mi_cupon = mis_cupones[0];
        const cupon = await Cupon.findById(mi_cupon.cupon);

        if (cupon.vencido) {
            return res.status(200).json({ ok: false });
        }

        const cuponData = {
            proximos_pedidos: cupon.usos_por_usuario - mi_cupon.usos,
            tipo: cupon.tipo,
            codigo: cupon.codigo,
            descuento: cupon.descuento,
            tope: cupon.tope
        };

        res.status(200).json({ ok: true, cupon: cuponData, id: mi_cupon._id });
    },

    useCoupon: async (req, res, next) => {

        const id = req.query.id;
        const mi_cupon = await CuponUsuario.findById(id);
        const cupon = await Cupon.findById(mi_cupon.cupon);

        mi_cupon.usos += 1;

        if (mi_cupon.usos >= cupon.usos_por_usuario) {
            mi_cupon.isActive = false;
        }

        await CuponUsuario.findByIdAndUpdate(mi_cupon._id, mi_cupon);
        res.status(200).json({});
    },

    addCoupon: async (req, res, next) => {
        const body = req.body;
        const cupon = await Cupon.findOne({ codigo: body.codigo });

        if (!cupon) {
            return res.status(200).json({ ok: false, message: messages.general.cupon_no_valido });
        }

        if (!cupon.isActive) {
            return res.status(200).json({ ok: false, message: messages.general.cupon_desactivado });
        }

        if (cupon.vencido) {
            return res.status(200).json({ ok: false, message: messages.general.cupon_vencido });
        }

        if (cupon.agotado) {
            return res.status(200).json({ ok: false, message: messages.general.cupon_agotado });
        }

        if (cupon.accion == 'ACTIVAR_EMPRESA') {
            const usuario = await Usuario.findById(body.usuario);
            usuario.tienda_tipo = cupon.tienda_tipo;
            usuario.role = 'EMPRESA_ROLE';
            await Usuario.findByIdAndUpdate(body.usuario, usuario);

            cupon.veces_usado += 1;

            if (cupon.veces_usado >= cupon.limite_de_usos) {
                cupon.agotado = true;
            }

            await Cupon.findByIdAndUpdate(cupon._id, cupon);

            return res.status(200).json({ ok: true, tipo: 'ACTIVACION', tienda: cupon.tienda_tipo });
        }

        if (cupon.accion == 'AÑADIR_PROMO') {

            const cuponUsuario = await CuponUsuario.findOne({ usuario: body.usuario, cupon: cupon._id });

            if (cuponUsuario) {
                return res.status(200).json({ ok: false, message: messages.general.cupon_ingresado });
            }

            cupon.veces_usado += 1;

            if (cupon.veces_usado >= cupon.limite_de_usos) {
                cupon.agotado = true;
            }

            await Cupon.findByIdAndUpdate(cupon._id, cupon);

            body.created = new Date().getTime();
            body.cupon = cupon._id;

            await CuponUsuario.create(body);

            return res.status(200).json({ ok: true, tipo: 'PROMO' });
        }

    },

    ubicacionGet: async (req, res, next) => {
        const id = req.query.id;
        const ubicacion = await Ubicacion.findOne({ usuario: id });

        if (!ubicacion) {
            return res.status(200).json({ ok: false });
        }

        res.status(200).json({ ok: true, ubicacion });
    },

    ubicacionCreate: async (req, res, next) => {
        const body = req.body;
        const ubicacion = await Ubicacion.create(body);
        res.status(200).json({ ok: true, ubicacion });
    },

    ubicacionUpdate: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;

        const ubicacion = await Ubicacion.findByIdAndUpdate(id, body, { new: true });
        res.status(200).json({ ok: true, ubicacion });
    },

    cuotaPedidosProgramados: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;

        const seleccion = body.seleccion;

        const today = moment().tz("America/Santiago").format('YYYY-MM-DD');
        const start_ms = moment(today + ' ' + seleccion.start, 'YYYY-MM-DD H').format('x');
        const end_ms = moment(today + ' ' + seleccion.end, 'YYYY-MM-DD H').format('x');

        const pedidos = await Pedido.find({
            cliente: id,
            programado: true,
            fecha_recogida_ms: { $gte: start_ms, $lte: end_ms }
        });

        if (pedidos.length > 20) {
            const message = `Ya tienes 20 pedidos programados entre las ${seleccion.start} y ${seleccion.end} hs. Selecciona otro horario.`;
            return res.status(200).json({ ok: false, message });
        }

        res.status(200).json({ ok: true });
    },

    balanceTurno: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;

        let balance = await BalanceTurno.findOne({ rider: id, activo: true });

        if (!balance) {

            const data = {
                rider: id,
                fecha_inicio: moment().tz("America/Santiago").format('D MMM h:mm A'),
                created: new Date().getTime(),
                codigo: Math.random().toString(36).substr(2, 8)
            };

            balance = await BalanceTurno.create(data);
        }

        if (body.tipo == 'Tarjeta') {
            balance.total_tarjeta += body.monto;
        }

        if (body.tipo == 'Efectivo') {
            balance.total_efectivo += body.monto;
        }

        balance.moviapp_ganancia_real += body.monto;

        balance.pedidos_contador += 1;

        const data = await BalanceTurno.findByIdAndUpdate(balance._id, balance);
        res.status(200).json(data);
    },

    balanceLibre: async (req, res, next) => {

        const id = req.query.id;
        const body = req.body;

        let balance = await BalanceLibre.findOne({ rider: id, activo: true });

        if (!balance) {

            const data = {
                rider: id,
                fee: body.turnoSet ? 0.3 : 0.2,
                fecha_inicio: moment().tz("America/Santiago").format('D MMM h:mm A'),
                created: new Date().getTime(),
                codigo: Math.random().toString(36).substr(2, 8)
            };

            balance = await BalanceLibre.create(data);
        }

        if (body.tipo == 'Tarjeta') {
            balance.total_tarjeta += body.monto;
            balance.rider_ganancia += Math.round((body.monto * (1 - balance.fee)) * 10) / 10;
            balance.moviapp_deuda += Math.round((body.monto * (1 - balance.fee)) * 10) / 10;
            balance.moviapp_ganancia_virtual += Math.round((body.monto * balance.fee) * 10) / 10;
            balance.moviapp_ganancia_real += Math.round((body.monto_promo - body.monto * (1 - balance.fee)) * 10) / 10;
        }

        if (body.tipo == 'Efectivo') {
            balance.total_efectivo += body.monto;
            balance.rider_ganancia += Math.round((body.monto * (1 - balance.fee)) * 10) / 10;
            balance.rider_deuda += Math.round((body.monto_promo * balance.fee) * 10) / 10;
            balance.moviapp_deuda += Math.round(((body.monto - body.monto_promo) * (1 - balance.fee)) * 10) / 10;
            balance.moviapp_ganancia_virtual += Math.round((body.monto * balance.fee) * 10) / 10;
            balance.moviapp_ganancia_real += Math.round((body.monto_promo - body.monto * (1 - balance.fee)) * 10) / 10;
        }

        balance.pedidos_contador += 1;

        const data = await BalanceLibre.findByIdAndUpdate(balance._id, balance);
        res.status(200).json(data);
    },

    getBalanceTurno: async (req, res, next) => {
        const id = req.query.id;
        const balance = await BalanceTurno.findOne({ rider: id, activo: true });
        res.status(200).json(balance);
    },

    getBalanceLibre: async (req, res, next) => {
        const id = req.query.id;
        const balance = await BalanceLibre.findOne({ rider: id, activo: true });
        res.status(200).json(balance);
    },

    getAllBalanceTurno: async (req, res, next) => {
        const id = req.query.id;

        const balances = await BalanceTurno.find({
            rider: id,
            activo: false
        }).sort({ created: -1 }).limit(15);

        res.status(200).json(balances);
    },

    getAllBalanceLibre: async (req, res, next) => {
        const id = req.query.id;

        const balances = await BalanceLibre.find({
            rider: id,
            activo: false
        }).sort({ created: -1 }).limit(15);

        res.status(200).json(balances);
    },

    createBalance: async (req, res, next) => {
        const body = req.body;
        await Balance.create(body);
        res.status(200).json({});
    },

    getTarifas: async (req, res, next) => {
        const ciudad = req.query.ciudad;
        const tarifas = await Tarifas.findOne({ ciudad });
        res.status(200).json(tarifas);
    },

    createCheckout: async (req, res, next) => {
        const body = req.body;
        body.created = new Date().getTime();
        const checkout = await Checkout.create(body);
        res.status(200).json(checkout);
    },

    getCheckout: async (req, res, next) => {
        const id = req.query.id;

        const checkout = await Checkout.findById(id);

        let ok = true;

        if (new Date().getTime() - checkout.created > 5 * 60 * 1000) {
            ok = false;
        }

        res.status(200).json({ ok });
    },

    updateCheckout: async (req, res, next) => {
        const id = req.query.id;
        await Checkout.findByIdAndUpdate(id, { pedido_cancelado: true });
        res.status(200).json({});
    },

    getPagos: async (req, res, next) => {
        const id = req.query.id;
        const pagos = await Pago.find({ rider: id }).sort({ created: -1 }).limit(15);
        res.status(200).json(pagos);
    },

    createHorario: async (req, res, next) => {
        const data = {
            rider: 'adadad',
            horario: [],
            created: new Date().getTime()
        };

        await Horario.create(data);
    },

    getHorario: async (req, res, next) => {
        const data = setHorario();
        res.status(200).json(data);
    },

    getOneHorario: async (req, res, next) => {
        const id = req.query.id;
        const horario = await Horario.findOne({ rider: id });
        res.status(200).json(horario);
    },

    updateHorario: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;

        let horario = await Horario.findOne({ rider: id });

        if (!horario) {

            const data = {
                rider: id,
                created: new Date().getTime()
            };

            horario = await Horario.create(data);
        }

        await Horario.findByIdAndUpdate(horario._id, {
            horas: body.horas,
            dias: body.dias,
        });

        res.status(200).json({});
    },

    createBalanceEmpresa: async (req, res, next) => {
        const body = req.body;
        body.codigo = Math.random().toString(36).substr(2, 8);
        body.fecha_inicio = moment().tz("America/Santiago").format('D MMM h:mm A');
        await BalanceEmpresa.create(body);
        res.status(200).json({});
    },

    getBalanceEmpresa: async (req, res, next) => {
        const id = req.query.id;
        const balances = await BalanceEmpresa.find({
            usuario: id,
            procesado: true
        });
        res.status(200).json(balances);
    },

    balanceEmpresa: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;

        const balance = await BalanceEmpresa.findOne({ usuario: id, activo: true })

        balance.deuda_empresa += body.monto;
        balance.pedidos_contador += 1;

        await BalanceEmpresa.findByIdAndUpdate(balance._id, balance);
        res.status(200).json({});
    },

    updatePedido: async (req, res, next) => {
        const id = req.query.id;
        const body = req.body;
        await Pedido.findByIdAndUpdate(id, body);
        res.status(200).json({});
    },

    robotGetUsuario: async (req, res, next) => {

        const telefono = req.query.tel;
        let usuario = await Usuario.findOne({ telefono, role: 'EMPRESA_ROLE' });

        if (!usuario) {
            usuario = await Usuario.findOne({ telefono, role: 'USUARIO_ROLE' });
        }

        if (!usuario) {
            return res.status(200).json({ ok: false });
        }

        res.status(200).json({ ok: true, nombre: usuario.nombre, id: usuario._id });
    },

    robotUpdateLocation: async (req, res, next) => {
        const body = req.body;

        const location = await Location.findOne({ usuario: body.id });

        const data = await geocoder.reverse({ lat: Number(body.lat), lon: Number(body.lng) });

        await Location.findByIdAndUpdate(location._id, {
            destino: {
                direccion: data[0].formattedAddress,
                lat: Number(body.lat),
                lng: Number(body.lng)
            },
            activo: true
        });

        res.status(200).json({ ok: true });
    },

    getLocation: async (req, res, next) => {
        const id = req.query.id;

        let location = await Location.findOne({ usuario: id });

        if (!location) {
            location = Location.create({ usuario: id });
        }

        res.status(200).json(location);
    }
}