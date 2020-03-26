const router = require('express-promise-router')();

const dashCtrl = require('../../controllers/v1.0.1/dash');
const tarifasCtrl = require('../../controllers/v1.0.1/tarifas');

const { verificaToken } = require('../../middlewares/auth');
const { verificaAdmin } = require('../../middlewares/role');


router.route('/create-account')
    .post(dashCtrl.createAccount);

router.route('/update-account')
    .put([verificaToken, verificaAdmin], dashCtrl.updateAccount);

router.route('/riders-get-one-by-phone')
    .get([verificaToken, verificaAdmin], dashCtrl.riderGetOneByPhone);

router.route('/riders-get-by-filter')
    .post([verificaToken, verificaAdmin], dashCtrl.riderGetByFilter);

router.route('/empresas-get-by-filter')
    .post([verificaToken, verificaAdmin], dashCtrl.empresaByFilter);

router.route('/admin-create-account')
    .post(dashCtrl.createAdmin);

router.route('/pedidos-get-by-phone-rider')
    .post([verificaToken, verificaAdmin], dashCtrl.pedidosGetByPhone_rider);

router.route('/pedidos-get-by-phone-empresa')
    .post([verificaToken, verificaAdmin], dashCtrl.pedidosGetByPhone_empresa);

router.route('/crear-pedido')
    .get([verificaToken, verificaAdmin], dashCtrl.crearPedido);

router.route('/pedidos-get-one')
    .get([verificaToken, verificaAdmin], dashCtrl.pedidosGetOne);

router.route('/pedidos-delete-one')
    .get([verificaToken, verificaAdmin], dashCtrl.pedidosDeleteOne);

router.route('/pedidos-update')
    .put([verificaToken, verificaAdmin], dashCtrl.updatePedido);

router.route('/tarifas-get-all')
    .get([verificaToken, verificaAdmin], tarifasCtrl.getAll);

router.route('/tarifas-create')
    .get([verificaToken, verificaAdmin], tarifasCtrl.create);

router.route('/tarifas-update')
    .put([verificaToken, verificaAdmin], tarifasCtrl.update);

router.route('/registros-de-actividad-riders-update')
    .put([verificaToken, verificaAdmin], dashCtrl.updateActividadRiders);

router.route('/registros-de-actividad-riders-get-all')
    .post([verificaToken, verificaAdmin], dashCtrl.getActividadRiders);

router.route('/cupones-create')
    .post([verificaToken, verificaAdmin], dashCtrl.createCoupon);

router.route('/cupones-get-all')
    .get([verificaToken, verificaAdmin], dashCtrl.getCoupons);

router.route('/cupones-get-by-filter')
    .post([verificaToken, verificaAdmin], dashCtrl.getCouponsByFilter);

router.route('/crear-actividad')
    .get(dashCtrl.crearRiderActividad);

router.route('/balances-create')
    .post([verificaToken, verificaAdmin], dashCtrl.createBalances);

router.route('/balance-libre-get')
    .post([verificaToken, verificaAdmin], dashCtrl.getBalanceLibre);

router.route('/balance-turno-get')
    .post([verificaToken, verificaAdmin], dashCtrl.getBalanceTurno);

router.route('/balance-libre-update')
    .put([verificaToken, verificaAdmin], dashCtrl.updateBalanceLibre);

router.route('/balance-turno-update')
    .put([verificaToken, verificaAdmin], dashCtrl.updateBalanceTurno);

module.exports = router;