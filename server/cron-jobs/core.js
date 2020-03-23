const CronJob = require('cron').CronJob;
const axios = require('axios');
const moment = require('moment');
moment.locale('es');

const Cupon = require('../models/cupon');
const Checkout = require('../models/checkout');
const Usuario = require('../models/usuario');
const Turno = require('../models/horario-turno');
const BalanceTurno = require('../models/balance-turno');
const BalanceLibre = require('../models/balance-libre');
const Horario = require('../models/horario');


module.exports = {

    test: async () => {

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
                miliseconds,
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

        console.log(horario)
    },

    riders_liberacion: () => {

        new CronJob('*/2 * * * *', async () => {

            const time = new Date().getTime() - 5 * 60 * 1000;

            const checkouts = await Checkout.find({
                isActive: true,
                pedido_creado: false,
                pedido_cancelado: false,
                created: { $lte: time }
            });

            if (checkouts.length == 0) {
                return;
            }

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_liberacion';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            await axios.post(`${url}&tipo=riders`, checkouts);
            await axios.post(`${url}&tipo=coors`, checkouts);

            const promesas = [];

            checkouts.forEach(checkout => {
                promesas.push(
                    Checkout.findByIdAndUpdate(checkout._id, { isActive: false })
                );
            });

            await Promise.all(promesas);

        }, null, true, 'America/Santiago');
    },

    riders_desactivacion_por_tiempo: () => {
        // */5 * * * *
        new CronJob('*/3 * * * *', async () => {

            const time = new Date().getTime() - 40 * 60 * 1000;

            const riders = await Usuario.find({
                isActive: true,
                ocupado: false,
                estado_cambiado: false,
                last_login: { $lte: time }
            });

            if (riders.length == 0) {
                return;
            }

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_desactivacion';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            await axios.post(`${url}&tipo=riders`, riders);
            await axios.post(`${url}&tipo=coors`, riders);

            const promesas = [];

            riders.forEach(rider => {
                promesas.push(
                    Usuario.findByIdAndUpdate(rider._id, { estado_cambiado: true })
                );
            });

            await Promise.all(promesas);

        }, null, true, 'America/Santiago');
    },

    toggle_modalidad_turno: () => {

        new CronJob('9 * * * *', async () => {

            const fecha_hora = moment().tz("America/Santiago").format('DD-MM-YYYY H A');
            const time_string = moment(fecha_hora, 'DD-MM-YYYY H A').tz("America/Santiago").format('x');
            const miliseconds = Number(time_string);

            const horarios = await Horario.find({
                isActive: true
            });

            const activar_ids = [];
            const desactivar_ids = [];
            const terminar_ids = [];

            horarios.forEach(horario => {

                horario.horas.forEach(hora => {
                    if (hora.miliseconds == miliseconds) {

                        if (hora.isActive) {
                            activar_ids.push(horario.rider);
                        } else {
                            if (hora.isEnd) {
                                terminar_ids.push(horario.rider);
                            } else {
                                desactivar_ids.push(horario.rider);
                            }
                        }
                    }
                });
            });

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_modalidad';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            if (activar_ids.length > 0) {
                await axios.post(`${url}&tipo=activar`, activar_ids);
            }

            if (desactivar_ids.length > 0) {
                await axios.post(`${url}&tipo=desactivar`, desactivar_ids);
            }

            // if (comenzar_ids.length > 0) {
            //     await axios.post(`${url}&tipo=comenzar`, comenzar_ids);
            // }

            if (terminar_ids.length > 0) {
                await axios.post(`${url}&tipo=terminar`, terminar_ids);
            }

        }, null, true, 'America/Santiago');
    },

    riders_turnos: () => {
        // 1 * * * *
        new CronJob('1 * * * *', async () => {

            const hora = moment().tz("America/Santiago").format('H');

            const activar_turnos = await Turno.find({
                isActive: true,
                inicio: hora,
                inicio_activo: false
            });

            const desactivar_turnos = await Turno.find({
                isActive: true,
                termino: hora,
                termino_activo: false
            });

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_modalidad';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            if (activar_turnos.length > 0) {

                await axios.post(`${url}&tipo=activar`, activar_turnos);

                const promesas = [];

                activar_turnos.forEach(turno => {
                    promesas.push(
                        Turno.findByIdAndUpdate(turno._id, {
                            inicio_activo: true,
                            termino_activo: false
                        })
                    );
                });

                await Promise.all(promesas);
            }

            if (desactivar_turnos.length > 0) {
                await axios.post(`${url}&tipo=desactivar`, desactivar_turnos);

                const promesas = [];

                desactivar_turnos.forEach(turno => {
                    promesas.push(
                        Turno.findByIdAndUpdate(turno._id, {
                            inicio_activo: false,
                            termino_activo: true
                        })
                    );
                });

                await Promise.all(promesas);
            }

        }, null, true, 'America/Santiago');
    },

    procesar_balance_turno: () => {
        // 1 20 * * *
        new CronJob('1 17 */3 * *', async () => {

            const balances = await BalanceTurno.find({
                isActive: true,
                procesado: false
            });

            const fecha = moment().tz("America/Santiago").format('D MMM h:mm A');

            const promesas = [];
            const riders = [];

            balances.forEach(balance => {

                if (balance.pedidos_contador != 0) {
                    riders.push(balance.rider);

                    
                    let restante = balance.total_efectivo;
                    let tipo = 'cobro';

                    promesas.push(
                        BalanceTurno.findByIdAndUpdate(balance._id, {
                            procesado: true,
                            activo: false,
                            rider_deuda: balance.total_efectivo,
                            rider_ganancia: 0,
                            fecha_termino: fecha,
                            restante,
                            tipo,
                            codigo: Math.random().toString(36).substr(2, 8)
                        })
                    );
                }
            });

            await Promise.all(promesas);

            const promesas_dos = [];

            const timeStamp = new Date().getTime();

            riders.forEach(id => {
                promesas_dos.push(
                    BalanceTurno.create({
                        rider: id,
                        fecha_inicio: fecha,
                        created: timeStamp
                    })
                )
            });

            await Promise.all(promesas_dos);

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_modalidad';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            await axios.post(`${url}&tipo=balance-turno`, riders);

        }, null, true, 'America/Santiago');
    },

    procesar_balance_libre: () => {
        // 5 20 */3 * *
        new CronJob('10 17 */3 * *', async () => {

            const balances = await BalanceLibre.find({
                isActive: true,
                procesado: false
            });

            const fecha = moment().tz("America/Santiago").format('D MMM h:mm A');

            const promesas = [];
            const riders = [];

            balances.forEach(balance => {

                if (balance.pedidos_contador != 0) {

                    const data = {
                        id: balance.rider,
                        fee: balance.fee
                    };

                    riders.push(data);

                    let restante = balance.rider_ganancia - balance.rider_deuda;
                    let tipo = 'pago';

                    if (restante < 0) {
                        tipo = 'cobro';
                    }

                    promesas.push(
                        BalanceLibre.findByIdAndUpdate(balance._id, {
                            procesado: true,
                            activo: false,
                            fecha_termino: fecha,
                            tipo,
                            restante: Math.abs(restante),
                            codigo: Math.random().toString(36).substr(2, 8)
                        })
                    );
                }
            });

            await Promise.all(promesas);

            const promesas_dos = [];

            const timeStamp = new Date().getTime();

            riders.forEach(rider => {
                promesas_dos.push(
                    BalanceLibre.create({
                        rider: rider.id,
                        fecha_inicio: fecha,
                        created: timeStamp,
                        fee: rider.fee
                    })
                )
            });

            const ids = [];

            riders.forEach(rider => {
                ids.push(rider.id)
            });

            await Promise.all(promesas_dos);

            let url = 'https://us-central1-mapa-334c3.cloudfunctions.net/riders_modalidad';

            process.env.NODE_ENV == 'DEV' ? url += '?entorno=dev' : url += '?entorno=prod';

            await axios.post(`${url}&tipo=balance-libre`, ids);

        }, null, true, 'America/Santiago');
    },


    cupones: () => {
        new CronJob('0 1 * * * ', async () => {
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

        }, null, true, 'America/Santiago');
    }
}

