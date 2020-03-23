const router = require('express-promise-router')();

const UsersController = require('../../controllers/v1.0.1/usuarios');

const { verificaToken, verificaPhone } = require('../../middlewares/auth');

router.route('/request-code')
  .post(UsersController.requestCode);

router.route('/verify-code')
  .post(UsersController.verifyCode);

router.route('/create-account')
  .post(verificaPhone, UsersController.createAccount);

router.route('/signin-riders')
  .post(UsersController.signInRiders);

router.route('/signin-email')
  .post(UsersController.signInEmail);

router.route('/get-one')
  .get(verificaToken, UsersController.getOne);

router.route('/update')
  .put(verificaToken, UsersController.update);

router.route('/update-password')
  .put(verificaToken, UsersController.updatePassword);

router.route('/last-login')
  .get(verificaToken, UsersController.lastLogin);

module.exports = router;