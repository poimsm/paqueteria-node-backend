const router = require('express-promise-router')();

const controller = require('../../controllers/v1.0.1/panda');


// --------------------------
//     ORDER
// --------------------------

router.route('/order-create-one')
    .post(controller.createOrder);

router.route('/order-get-queue')
    .get(controller.getQueue);

router.route('/order-get-all')
    .post(controller.getOrders);

router.route('/order-update')
    .put(controller.updateOrder);

    
// --------------------------
//     RIDER STATE
// --------------------------

router.route('/rider-state-create')
    .post(controller.createRiderState);

router.route('/rider-state-update')
    .put(controller.updateRiderState);

// --------------------------
//     RIDER LOCATION
// --------------------------

router.route('/rider-location-create')
    .post(controller.createRiderLocation);

router.route('/rider-location-uptate')
    .put(controller.updateRiderLocation);

// --------------------------
//     CUSTUMER STATE
// --------------------------

router.route('/customer-state-create')
    .put(controller.createCustomerState);

router.route('/customer-state-uptate')
    .put(controller.updateCustomerState);

module.exports = router;