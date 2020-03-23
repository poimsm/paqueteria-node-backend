const JWT = require('jsonwebtoken');
const querystring = require('querystring');
const http = require('https');

const Transaccion = require('../../models/transaccion-bancaria');

//SEGURIDAD
const crypto = require('crypto');

firmarString = (str) => {

    var hmac = crypto.createHmac('sha256', process.env.FLOW_SECRET);
    hmac.update(str);
    str = hmac.digest('hex');

    return str;
}

module.exports = {

    createTransaction: async (req, res, next) => {
        const body = req.body;
        body.created = new Date().getTime();
        const data = await Transaccion.create(body);
        res.status(200).json(data);
    },

    getTransaction: async (req, res, next) => {
        const id = req.query.id;
        const data = await Transaccion.findById(id).populate('usuario');
        res.status(200).json(data);
    },

    isUsed: async (req, res, next) => {
        const id = req.query.id;
        await Transaccion.findByIdAndUpdate(id, { isUsed: true });
        res.status(200).json();
    },

    FlowRequestURL: async (req, res, next) => {

        var _post_monto = req.body.monto,
            _post_email = req.body.email,
            _post_orden = new Date().getTime(),
            flow_response;

        var s_str = 'amount=' + _post_monto
            + '&apiKey=' + process.env.FLOW_APIKEY
            + '&commerceOrder=' + _post_orden
            + '&email=' + _post_email
            + '&paymentMethod=1'
            + '&subject=Prueba de pago'
            + '&urlConfirmation=https://joopiterweb.com/v1.0.1/pago/pago-confirmar'
            + '&urlReturn=https://joopiterweb.com/v1.0.1/pago/compra-exitosa';

        var s = firmarString(s_str);

        const postData = querystring.stringify({
            'apiKey': process.env.FLOW_APIKEY,
            'commerceOrder': _post_orden,
            'subject': 'Prueba de pago',
            'amount': _post_monto,
            'email': _post_email,
            'paymentMethod': '1',
            'urlConfirmation': 'https://joopiterweb.com/v1.0.1/pago/pago-confirmar',
            'urlReturn': 'https://joopiterweb.com/v1.0.1/pago/compra-exitosa',
            's': s,
        });

        // console.log('POSTDATA', postData)

        const options = {
            hostname: 'www.flow.cl',
            path: '/api/payment/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req_flow = http.request(options, (res_flow) => {
            res_flow.setEncoding('utf8');
            res_flow.on('data', (chunk) => {
                flow_response = chunk;

                /* ===================== PARA GUARDAR EN LA BBDD ===================== */
                console.log('hoola2')

                const flowOrder = Number(JSON.parse(flow_response).flowOrder);

                Transaccion.findByIdAndUpdate(req.body.transaccionID, { flowOrder }, { new: true }, (err, model) => {
                    console.log('MODELO', model);
                    res.status(200).json(JSON.parse(flow_response));
                });

                /* =================================================================== */

            });
            res_flow.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req_flow.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req_flow.write(postData);
        req_flow.end();

        const data = { "tipo": "url", "hmac": firmarString("aaaaaa") };

    },

    FlowConfirm: async (req, res, next) => {

        var _post_token = req.body.token,
            flow_response;

        // console.log("TOKEN:" + JSON.stringify(req.body.token));

        var s_str = 'apiKey=' + process.env.FLOW_APIKEY
            + '&token=' + _post_token

        var s = firmarString(s_str);

        const postData = querystring.stringify({
            'apiKey': process.env.FLOW_APIKEY,
            'token': _post_token,
            's': s,
        });
        console.log('hoola3')

        const options = {
            hostname: 'www.flow.cl',
            path: '/api/payment/getStatus?apiKey=' + process.env.FLOW_APIKEY + '&token=' + _post_token + '&s=' + s,
            method: 'GET'

        };

        const req_flow = http.request(options, (res_flow) => {
            res_flow.setEncoding('utf8');
            res_flow.on('data', (chunk) => {
                flow_response = chunk;


                const flowOrder = Number(JSON.parse(flow_response).flowOrder);

                const newData = {
                    pago_exitoso: true,
                    flow: JSON.parse(flow_response)
                }

                Transaccion.findOneAndUpdate({ flowOrder }, newData, { new: true }, (err, model) => {
                    console.log('MODELO', model);
                });


                //MODELO DE LA RESPUESTA

                /*
                {
                  "flowOrder": 3567899,
                  "commerceOrder": "sf12377",
                  "requestDate": "2017-07-21 12:32:11",
                  "status": 1,
                  "subject": "game console",
                  "currency": "CLP",
                  "amount": 12000,
                  "payer": "pperez@gamil.com",
                  "optional": {
                    "RUT": "7025521-9",
                    "ID": "899564778"
                  },
                  "pending_info": {
                    "media": "Multicaja",
                    "date": "2017-07-21 10:30:12"
                  },
                  "paymentData": {
                    "date": "2017-07-21 12:32:11",
                    "media": "webpay",
                    "conversionDate": "2017-07-21",
                    "conversionRate": 1.1,
                    "amount": 12000,
                    "fee": 551,
                    "balance": 11499,
                    "transferDate": "2017-07-24"
                  }
                }
                */

                res.status(200).json([]);

            });
            res_flow.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req_flow.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        // req_flow.write(postData);
        req_flow.end();

        const data = { "tipo": "url", "hmac": firmarString("aaaaaa") };

    },

    FlowCallback: async (req, res, next) => {

        res.set('Content-Type', 'text/html');
        res.send('<h1>Gracias por su compra</h1>');
    }
}
