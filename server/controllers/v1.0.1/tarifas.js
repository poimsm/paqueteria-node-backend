const bcrypt = require('bcryptjs');

const Tarifas = require('../../models/tarifas');

module.exports = {

    getActiveTarifas: async (req, res, next) => {

        const tarifasArr = await Tarifas.find({});
        const tarifas = tarifasArr[0];

        // "16/08/2019, 13:53:23"
        const today = new Date().toLocaleString('en-GB', { timeZone: 'America/Santiago' });
        const year = Number(today.split(',')[0].split('/')[2]);
        const month = Number(today.split(',')[0].split('/')[1]);
        const day = Number(today.split(',')[0].split('/')[0]);

        const now = new Date().getTime();
        const switchNight = new Date(year, month - 1, day, tarifas.horaCambioNoche).getTime();
        const switchDay = new Date(year, month - 1, day, tarifas.horaCambioDia).getTime();

        let data = {};

        if (now >= switchNight && now <= switchDay) {
            data = tarifas.noche;
        } else {
            data = tarifas.dia;
        }

        res.status(200).json(data);
    },

    getAll: async (req, res, next) => {

        const tarifasArr = await Tarifas.find({});
        const tarifas = tarifasArr[0];

        res.status(200).json(tarifas);
    },

    update: async (req, res, next) => {
        const body = req.body;
        const tarifasArr = await Tarifas.find({});
        const tarifas = tarifasArr[0];

        const newTarifas = await Tarifas.findByIdAndUpdate(tarifas._id, body);

        res.status(200).json({ tarifas: newTarifas });
    },


    create: async (req, res, next) => {

        const data = {
            noche: {
                bici: {
                    base: 200,
                    minima: 1000,
                    distancia: 250,
                    limite: 2.3,
                    maxLimite: 4.0
                },
                moto: {
                    base: 200,
                    minima: 1000,
                    distancia: 250,
                    limite: 2.3,
                    maxLimite: 20
                }
            },
            dia: {
                bici: {
                    base: 200,
                    minima: 800,
                    distancia: 200,
                    limite: 2.3,
                    maxLimite: 4.0
                },
                moto: {
                    base: 200,
                    minima: 800,
                    distancia: 200,
                    limite: 2.3,
                    maxLimite: 20
                }
            },
            horaCambioNoche: 22,
            horaCambioDia: 9
        }

        await Tarifas.create(data);
        res.status(200).json(data);
    }


}