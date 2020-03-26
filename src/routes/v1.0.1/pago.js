const router = require('express-promise-router')();

const controller = require('../../controllers/v1.0.1/pago');

const { verificaToken } = require('../../middlewares/auth');

router.route('/transaction-create-one')
    .post(controller.createTransaction);

router.route('/transaction-get-one')
    .get(controller.getTransaction);

router.route('/pago-iniciar')
    .post(controller.FlowRequestURL);

router.route('/pago-confirmar')
    .post(controller.FlowConfirm);

router.route('/compra-exitosa')
    .post(controller.FlowCallback);

module.exports = router;