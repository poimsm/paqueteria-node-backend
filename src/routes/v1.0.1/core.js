const router = require('express-promise-router')();

const coreCtrl = require('../../controllers/v1.0.1/core');
const tarifasCtrl = require('../../controllers/v1.0.1/tarifas');

const { verificaToken } = require('../../middlewares/auth');

router.route('/device-update')
    .put(verificaToken, coreCtrl.deviceUpadete);

router.route('/device-get-one')
    .get(verificaToken, coreCtrl.deviceGetOne);

router.route('/usuario-get-one')
    .get(verificaToken, coreCtrl.getOneUser);

router.route('/rating-get-active-one')
    .get(verificaToken, coreCtrl.getActiveRating);

router.route('/rating-update')
    .put(verificaToken, coreCtrl.clientUpdateRating);

router.route('/pedidos-create')
    .post(verificaToken, coreCtrl.crearPedido);

router.route('/pedidos-get-by-client-id')
    .get(verificaToken, coreCtrl.getPedidosByClientId);

router.route('/pedidos-get-by-rider-id')
    .get(verificaToken, coreCtrl.getPedidosByRiderId);

router.route('/pedidos-get-active-one')
    .get(verificaToken, coreCtrl.getPedidoActivo);

router.route('/pedidos-get-one')
    .get(verificaToken, coreCtrl.getOnePedido);

router.route('/pedidos-proof-of-delivery')
    .put(verificaToken, coreCtrl.proofOfDelivery);

router.route('/cupones-get-all')
    .get(verificaToken, coreCtrl.getCoupons);

router.route('/cupones-get-active-one')
    .get(verificaToken, coreCtrl.getActiveCoupon);

router.route('/cupones-add-one')
    .post(verificaToken, coreCtrl.addCoupon);

router.route('/cupones-use-one')
    .get(verificaToken, coreCtrl.useCoupon);

router.route('/ubicacion-get')
    .get(verificaToken, coreCtrl.ubicacionGet);

router.route('/ubicacion-create')
    .post(verificaToken, coreCtrl.ubicacionCreate);

router.route('/ubicacion-update')
    .put(verificaToken, coreCtrl.ubicacionUpdate);

router.route('/cuota-pedidos-programado')
    .post(verificaToken, coreCtrl.cuotaPedidosProgramados);

router.route('/tarifas-get')
    .get(coreCtrl.getTarifas);

router.route('/pedido-update')
    .put(coreCtrl.updatePedido);

router.route('/checkout-create')
    .post(coreCtrl.createCheckout);

router.route('/checkout-get')
    .get(coreCtrl.getCheckout);

router.route('/checkout-update')
    .get(coreCtrl.updateCheckout);

router.route('/pedido-cancelar')
    .put(coreCtrl.cancelarPedido);

router.route('/balance-turno')
    .put(verificaToken, coreCtrl.balanceTurno);

router.route('/balance-libre')
    .put(verificaToken, coreCtrl.balanceLibre);

router.route('/balance-turno-get')
    .get(verificaToken, coreCtrl.getBalanceTurno);

router.route('/balance-libre-get')
    .get(verificaToken, coreCtrl.getBalanceLibre);

router.route('/balance-turno-get-all')
    .get(verificaToken, coreCtrl.getAllBalanceTurno);

router.route('/balance-libre-get-all')
    .get(verificaToken, coreCtrl.getAllBalanceLibre);

router.route('/balance-create')
    .post(coreCtrl.createBalance);

router.route('/pago-get-all')
    .post(coreCtrl.getPagos);

router.route('/horario-get')
    .get(coreCtrl.getHorario);

router.route('/horario-get-one')
    .get(coreCtrl.getOneHorario);

router.route('/horario-update')
    .put(coreCtrl.updateHorario);

router.route('/balance-empresa-create')
    .post(coreCtrl.createBalanceEmpresa);

router.route('/balance-empresa')
    .put(coreCtrl.balanceEmpresa);

router.route('/balance-empresa-get')
    .get(coreCtrl.getBalanceEmpresa);

router.route('/pedido-update')
    .put(coreCtrl.updatePedido);

router.route('/robot-get-user')
    .get(coreCtrl.robotGetUsuario);

router.route('/robot-update-location')
    .post(coreCtrl.robotUpdateLocation);

router.route('/location-get')
    .get(verificaToken, coreCtrl.getLocation);

router.route('/pedido-confirm')
    .put(verificaToken, coreCtrl.pedidoConfirm);

module.exports = router;