const router = require('express').Router();

router.use('/v1.0.1', require('./v1.0.1/index'));

module.exports = router;
