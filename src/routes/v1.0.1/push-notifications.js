const router = require('express-promise-router')();

const controller = require('../../controllers/v1.0.1/push-notifications');


router.route('/subscription')
    .post(controller.subscription);

router.route('/send-notification')
    .post(controller.sendNotification);


module.exports = router;