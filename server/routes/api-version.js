const express = require('express');
const app = express();


app.get('/api-version', function (req, res) {

    const version = req.query.version;
    const app = req.query.app;

    let data = {};

    versiones_activas_clientes = ['1.7.3', '1.7.4', '1.7.5'];

    versiones_activas_riders = ['1.5.5', '1.5.6', '1.5.7'];

    if (app == 'clients') {

        let flag = false;

        versiones_activas_clientes.forEach(version_activa => {
            if (version_activa == version) {
                flag = true;
            }
        });

        if (flag) {
            data = {
                forceUpgrade: false,
                recommendUpgrade: false
            }
        } else {
            data = {
                forceUpgrade: true,
                recommendUpgrade: false
            }
        }
    }

    if (app == 'riders') {

        let flag = false;

        versiones_activas_riders.forEach(version_activa => {
            if (version_activa == version) {
                flag = true;
            }        
        });

        if (flag) {
            data = {
                forceUpgrade: false,
                recommendUpgrade: false
            }
        } else {
            data = {
                forceUpgrade: true,
                recommendUpgrade: false
            }
        }
    }

    console.log(version, app);
  
    res.status(200).json(data);
    
});

module.exports = app;