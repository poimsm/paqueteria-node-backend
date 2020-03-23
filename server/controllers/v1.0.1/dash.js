const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
moment.locale('es');

const appMessages = require('../../utils/messages');
const Usuario = require('../../models/usuario');
const Pedido = require('../../models/pedido');
const ActivadaRider = require('../../models/actividad-rider');
const Dato = require('../../models/dato');
const Cupon = require('../../models/cupon');
const BalanceTurno = require('../../models/balance-turno');
const BalanceLibre = require('../../models/balance-libre');
const Horario = require('../../models/horario');


let signToken = (uid, role) => {
  return JWT.sign({
    iss: 'moviapp',
    uid,
    role
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG_EXPIRATION });
}

module.exports = {

  createAdmin: async (req, res, next) => {

    const body = req.body;
    body.password = bcrypt.hashSync(body.password, 10);
    body.created = new Date().getTime();

    body.img = {
      id: '',
      url: 'https://res.cloudinary.com/ddon9fx1n/image/upload/v1561055940/capturas/descarga.jpg'
    };

    res.status(200).json();
  },

  updateAccount: async (req, res, next) => {
    const id = req.query.id;
    const body = req.body;
    const usuario = await Usuario.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({ ok: true, usuario });
  },

  createBalances: async (req, res, next) => {
    const body = req.body;

    if (body.turnoSet) {

      const dataTurno = {
        rider: body.rider,
        fecha_inicio: moment().tz("America/Santiago").format('D MMM h:mm A'),
        created: new Date().getTime(),
        codigo: Math.random().toString(36).substr(2, 8)
      }

      await BalanceTurno.create(dataTurno);

      const dataHorario = {
        rider: body.rider,
        horas: [],
        created: new Date().getTime(),
        codigo: Math.random().toString(36).substr(2, 8)
      }

      await Horario.create(dataHorario);

      const dataLibre = {
        rider: body.rider,
        fee: 0.3,
        fecha_inicio: moment().tz("America/Santiago").format('D MMM h:mm A'),
        created: new Date().getTime()
      }

      await BalanceLibre.create(dataLibre);

    } else {

      const dataLibre = {
        rider: body.rider,
        fee: 0.2,
        fecha_inicio: moment().tz("America/Santiago").format('D MMM h:mm A'),
        created: new Date().getTime(),
        codigo: Math.random().toString(36).substr(2, 8)
      }

      await BalanceLibre.create(dataLibre);
    }
    res.status(200).json({});
  },

  createAccount: async (req, res, next) => {

    const body = req.body;
    const foundUser = await Usuario.findOne({ telefono: body.telefono, role: "RIDER_ROLE" });

    if (foundUser) {
      return res.status(200).json({ ok: false, err: { tipo: 'telefono-existe', text: 'Ya está registrado este teléfono' } });
    }

    const password = Math.random().toString(10).substr(2, 4);

    body.password = bcrypt.hashSync(password, 10);
    body.created = new Date().getTime();

    const usuario = await Usuario.create(body);
    const token = signToken(usuario._id);

    res.status(200).json({ ok: true, token, usuario, password });
  },

  riderGetByFilter: async (req, res, next) => {
    const query = req.body;
    const riders = await Usuario.find(query);
    res.status(200).json({ ok: true, riders });
  },

  empresaByFilter: async (req, res, next) => {
    const body = req.body;

    const query = {};

    if (body.cuenta != 'todo') {
      if (body.cuenta == 'activada') {
        query['isActive'] = true;
      } else {
        query['isActive'] = false;
      }
    }

    query['role'] = 'EMPRESA_ROLE';

    const empresas = await Usuario.find(query);

    res.status(200).json({ ok: true, empresas });
  },

  pedidosGetByPhone_rider: async (req, res, next) => {
    const body = req.body;

    const riders = await Usuario.find({ telefono: body.telefono });
    const rider = riders[0];

    const start = new Date(body.inicio + ' 00:01').getTime();
    const end = new Date(body.termino + ' 23:59').getTime();

    if (start >= end) {
      return res.status(200).json({ ok: false });
    }

    const pedidos = await Pedido.find({
      rider,
      entregado: true,
      cancelado: false,
      created: { $gte: start, $lte: end }
    }).populate('cliente').sort({ created: -1 });


    res.status(200).json({ ok: true, pedidos, rider });
  },

  pedidosGetByPhone_empresa: async (req, res, next) => {
    const body = req.body;

    const empresa = await Usuario.findOne({ telefono: body.telefono });
    // const empresa = empresas[0];

    const start = new Date(body.inicio + ' 00:01').getTime();
    const end = new Date(body.termino + ' 23:59').getTime();

    if (start >= end) {
      return res.status(200).json({ ok: false });
    }

    const pedidos = await Pedido.find({
      cliente: empresa,
      entregado: true,
      cancelado: false,
      created: { $gte: start, $lte: end }
    }).populate('rider');

    res.status(200).json({ ok: true, pedidos, empresa });
  },

  crearPedido: async (req, res, next) => {
    const data = {
      rider: '5d5a0d195aca955d4c6b86cd',
      cliente: '5d5a13438e1ed649906f2f79'
    }

    await Pedido.create(data)
    res.status(200).json({ listo: 'ok' });
  },

  pedidosGetOne: async (req, res, next) => {
    const id = req.query.id;
    const pedido = await Pedido.findById(id).populate('rider');
    res.status(200).json(pedido);
  },

  getActividadRiders: async (req, res, next) => {
    const body = req.body;

    if (body.dia.start >= body.dia.end) {
      return res.status(200).json({ ok: false });
    }

    const registros = await ActivadaRider.aggregate([
      {
        $match: {
          created: {
            $gte: body.dia.start,
            $lte: body.dia.end
          }
        }
      }
    ]);

    const dias = [];
    const riders = [];

    registros.forEach(registro => {
      dias.push(registro.formato_dia_mes);
      riders.push(registro.total_riders_activos);
    });

    res.status(200).json({ ok: true, dias, riders });
  },

  updateActividadRiders: async (req, res, next) => {
    const body = req.body;
    const datos = await Dato.find({});
    const id = datos[0].actividad_id;
    const actividad = await ActivadaRider.findById(id);

    if (body.isActive) {
      actividad.total_riders_activos += 1;
    } else {
      actividad.total_riders_activos -= 1;
    }

    await ActivadaRider.findByIdAndUpdate(id, actividad);
    res.status(200).json();
  },

  crearRiderActividad: async (req, res, next) => {
    const data = {
      fecha_creacion: '08 oct.',
      created: 89239238,
      total_riders_activos: 20
    }
    await ActivadaRider.create(data)
    res.status(200).json({ listo: 'ok' });
  },

  riderGetOneByPhone: async (req, res, next) => {
    const telefono = req.query.telefono;
    const rider = await Usuario.findOne({ telefono });

    if (!rider) {
      return res.status(200).json({ ok: false, message: appMessages.rider.rider_not_found });
    }

    res.status(200).json({ ok: true, rider });
  },

  pedidosDeleteOne: async (req, res, next) => {
    const id = req.query.id;
    const rider = await Pedido.findOneAndDelete({ rider: id, entregado: false, cancelado: false });

    if (!rider) {
      return res.status(200).json({ ok: false, message: appMessages.rider.pedido_not_found });
    }

    res.status(200).json({ ok: true, rider });
  },

  updatePedido: async (req, res, next) => {
    const id = req.query.id;
    const body = req.body;

    const pedido = await Pedido.findByIdAndUpdate(id, body);

    if (!pedido) {
      return res.status(200).json({ ok: false, message: appMessages.rider.pedido_not_found });
    }

    res.status(200).json({ ok: true });
  },

  createCoupon: async (req, res, next) => {

    const body = req.body;
    body.created = new Date().getTime();

    let codigo = Math.random().toString(36).substr(2, 6);
    body.codigo = codigo;

    const found = await Cupon.findOne({ codigo });

    if (found) {
      codigo = Math.random().toString(36).substr(2, 6);
      body.codigo = codigo;
    }

    const startDate = moment().tz("America/Santiago").format('YYYY-MM-DD');
    const endDate = body.termino;
    const timeDiff = (new Date(startDate)) - (new Date(endDate));

    body.dias_restantes = - Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    body.valido_hasta = moment(body.termino).format('DD MMM YYYY');
    body.valido_hasta_ms = moment(body.termino).format('x');

    await Cupon.create(body);
    res.status(200).json({ ok: true });
  },

  getCoupons: async (req, res, next) => {

    const cupones = await Cupon.find({});
    res.status(200).json({ ok: true, cupones });
  },

  getCouponsByFilter: async (req, res, next) => {
    const query = req.body;
    const cupones = await Cupon.find(query);
    res.status(200).json({ ok: true, cupones });
  },

  getBalanceLibre: async (req, res, next) => {
    const query = req.body;
    const balances = await BalanceLibre.find(query);
    res.status(200).json(balances);
  },

  getBalanceTurno: async (req, res, next) => {
    const query = req.body;
    const balances = await BalanceTurno.find(query);
    res.status(200).json(balances);
  },

  updateBalanceLibre: async (req, res, next) => {
    const id = req.query.id;
    const body = req.body;
    await BalanceLibre.findByIdAndUpdate(id, body);
    res.status(200).json({});
  },

  updateBalanceTurno: async (req, res, next) => {
    const id = req.query.id;
    const body = req.body;
    await BalanceTurno.findByIdAndUpdate(id, body);
    res.status(200).json({});
  },
}