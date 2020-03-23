const express = require('express');
const app = express();

const BalanceTurno = require('../models/balance-turno');
const BalanceLibre = require('../models/balance-libre');
const Usuario = require('../models/usuario');
const Turno = require('../models/horario-turno');


app.get('/turnos', async (req, res) => {

    const riders = await Usuario.find({
        isActive: true,
        role: 'RIDER_ROLE'
    });

    console.log(riders.length, 'length')

    let promesas = [];

    riders.forEach(rider => {

        const bodyTurno = {
            rider: rider._id,
            inicio: 12,
            termino: 20
        };

        promesas.push(
            Turno.create(bodyTurno)
        );

    });

    await Promise.all(promesas);

    const turnos = await Turno.find({
        isActive: true
    });

    let promesas_dos = [];

    turnos.forEach(turno => {
        riders.forEach(rider => {
            if (rider._id == turno.rider) {

                promesas_dos.push(
                    Usuario.findByIdAndUpdate(rider._id, {
                        turno: turno._id,
                        turnoSet: true,
                        ocupado: false,
                        estado_cambiado: false,
                        last_login: 1575980781259
                    })
                );
            }
        });
    });

    await Promise.all(promesas_dos);

    res.status(200).json({ ok: 'turnos' });
});

app.get('/balance-libre', async (req, res) => {

    const timeStamp = new Date().getTime();

    const riders = await Usuario.find({
        isActive: true,
        role: 'RIDER_ROLE'
    });

    const promesas = [];

    riders.forEach(rider => {

        const body = {            
            rider: rider._id,
            fecha_inicio: '10 dic. 12:00 PM',
            created: timeStamp,
            fee: 0.3
        };

        promesas.push(
            BalanceLibre.create(body)
        );

    });

    await Promise.all(promesas);

    res.status(200).json({ ok: 'balance-libre' });
});

app.get('/balance-turno', async (req, res) => {

    const timeStamp = new Date().getTime();

    const riders = await Usuario.find({
        isActive: true,
        role: 'RIDER_ROLE'
    });

    const promesas = [];

    riders.forEach(rider => {

        const body = {
            rider: rider._id,
            fecha_inicio: '10 dic. 12:00 PM',
            created: timeStamp
        };

        promesas.push(
            BalanceTurno.create(body)
        );

    });

    await Promise.all(promesas);

    res.status(200).json({ ok: 'balance-turno' });
});

module.exports = app;