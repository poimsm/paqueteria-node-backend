const moment = require('moment');
moment.locale('es');

const Registro = require('../../models/actividad-rider');
const Dato = require('../../models/dato');
const Cupon = require('../../models/cupon');

module.exports = {

    crearRegistro: async (req, res, next) => {
        const datos = await Dato.find({});
        const id = datos[0].actividad_id;
        const registro_anterior = await Registro.findById(id);

        const registro = {};

        registro.total_riders_activos = registro_anterior.total_riders_activos;
        registro.created = registro_anterior.created + 60 * 60 * 24 * 1000;
        registro.fecha_creacion = moment(registro_anterior.created + 60 * 60 * 24 * 1000).format('DD MMM');

        const nuevoRegistro = await Registro.create(registro);
        await Dato.findByIdAndUpdate(datos[0]._id, { actividad_id: nuevoRegistro._id })
        res.status(200).json({ ok: true });
    },

    actualizarCupones: async (req, res, next) => {

        const cupones = await Cupon.find({ isActive: true, vencido: false, agotado: false });

        const today = moment().tz("America/Santiago").format('YYYY-MM-DD');
        const today_ms = moment(today).format('x');

        const cupones_vencidos = [];

        cupones.forEach(cupon => {
            if (today_ms > cupon.valido_hasta_ms) {
                cupones_vencidos.push(cupon._id);
            }
        });

        const cupones_actualizados = await Cupon.updateMany({ _id: { $in: cupones_vencidos } }, { $set: { vencido: true } });

        const startDate = moment().tz("America/Santiago").format('YYYY-MM-DD');
        const promesas = [];

        cupones_actualizados.forEach(cupon => {
            const endDate = moment(cupon.valido_hasta_ms).format("YYYY-MM-DD");
            const timeDiff = (new Date(startDate)) - (new Date(endDate));
            cupon.dias_restantes = - Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            promesas.push(Cupon.findByIdAndUpdate(cupon._id, cupon));
        });

        Promise.all(promesas).then(() => {
            res.status(200).json({ ok: true });
        });
    }
}