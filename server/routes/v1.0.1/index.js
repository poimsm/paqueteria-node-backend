const router = require('express').Router();

router.use('/usuarios', require('./usuarios'));
router.use('/imgs', require('./upload'));
router.use('/pago', require('./pago'));
router.use('/core', require('./core'));
router.use('/dash', require('./dash'));
router.use('/cronjobs', require('./cronjobs'));
router.use('/push-notifications', require('./push-notifications'));

module.exports = router;
