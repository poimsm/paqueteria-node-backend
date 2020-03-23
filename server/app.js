require('./config/config');

const express = require('express')
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const crons = require('./cron-jobs/core');

app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    limit: '5mb',
    parameterLimit: 100000,
    extended: false
}));

app.use(bodyParser.json({
    limit: '5mb'
}));


//-------------------------
//      Carpeta public
//-------------------------
app.use(express.static(path.resolve(__dirname, '../public')));


//-------------------------
//       Rutas
//-------------------------
app.use('/', require('./routes/index'));
app.use('/', require('./routes/api-version'));
// app.use('/db', require('./routes/db-admin'));


//-------------------------
//       Cron jobs
//-------------------------

crons.toggle_modalidad_turno();
crons.procesar_balance_turno();
crons.procesar_balance_libre();
crons.riders_liberacion();

// crons.test();
// crons.riders_turnos();
// crons.riders_desactivacion_por_tiempo();
// crons.riders_desactivacion_por_pedidos();

//----------------------------
//       Dispatching system
//----------------------------
require('./panda/core')



//-------------------------
//       SocketIO
//-------------------------
const server = require('http').createServer(app);
const io = require('socket.io')(server);

module.exports = { io };


console.log(`Entorno ${process.env.NODE_ENV}`);

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});

