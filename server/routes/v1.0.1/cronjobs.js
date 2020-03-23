const router = require('express-promise-router')();

const crontroller = require('../../controllers/v1.0.1/cronjobs');


router.route('/crear-registro')
    .get(crontroller.crearRegistro);

module.exports = router;