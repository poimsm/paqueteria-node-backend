const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const accountSid = 'AC10398816ed1ca40f1d51d6bfdb3563d1';
const token = 'ac23f4d7d586ed847d232ac5157db061';
const client = require('twilio')(accountSid, token);

const Usuario = require('../../models/usuario');
const Codigo = require('../../models/codigo-verificacion');

const appMessages = require('../../utils/messages');

let signToken = (uid, role) => {
  return JWT.sign({
    iss: 'moviapp',
    uid,
    role
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG_EXPIRATION });
}

let signTokenPhone = (phone) => {
  return JWT.sign({
    iss: 'moviapp',
    phone
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SHORT_EXPIRATION });
}

twilioRequestCode = () => {
  return new Promise((resolve, reject) => {
    client.messages.create({
      to: '+56936271323',
      from: '+56931402276',
      body: `Tu codigo MoviApp es: ${codigo}. Valido por 2 minutos.`
    }).then(() => {
      resolve({ ok: true })
    }).catch(() => {
      resolve({ ok: false })
    });
  });
}


module.exports = {

  createAccount: async (req, res, next) => {
    const body = req.body;
    body.created = new Date().getTime();
    body.role = 'USUARIO_ROLE';
    const usuario = await Usuario.create(body);
    const token = signToken(usuario._id, body.role);
    res.status(200).json({ ok: true, token, usuario });
  },

 
  verifyCode: async (req, res, next) => {

    const body = req.body;
    const codigo = await Codigo.findById(body.id);
    const timestamp = new Date().getTime();
    const delta = timestamp - body.created;

    if (delta > 120) {
      return res.status(200).json({ ok: false, tipo: 'alert', message: 'Tu código ha expirado.' });
    }

    if (codigo.codigo != body.codigo) {
      return res.status(200).json({ ok: false, tipo: 'toast', message: 'Código incorrecto' });
    }

    await Codigo.findByIdAndUpdate(body.id, { used: true });


    if (body.tipo == 'usuario_nuevo') {
      const tokenPhone = signTokenPhone(body.telefono);
      return res.status(200).json({ ok: true, tipo: 'crear_cuenta', tokenPhone });
    }

    if (body.tipo == 'usuario_registrado') {
      const usuario = await Usuario.findOne({ telefono: body.telefono });
      const token = signToken(usuario._id, body.role);
      return res.status(200).json({ ok: true, tipo: 'autenticar_usuario', token, usuario });
    }
  },

  requestCode: async (req, res, next) => {

    const body = req.body;

    let usuario = await Usuario.findOne({ telefono: body.telefono, role: "USUARIO_ROLE" });

    if (!usuario) {
      usuario = await Usuario.findOne({ telefono: body.telefono, role: "EMPRESA_ROLE" });
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().getTime();

    const codigo = await Codigo.create({ telefono: body.telefono, codigo: code, created: timestamp });

    if (!usuario) {

      await client.messages.create({
        to: `+56${body.telefono}`,
        from: '+56931402276',
        body: `Tu codigo MoviApp es: ${code}. Valido por 2 minutos.`
      });

      return res.status(200).json({ ok: true, tipo: 'usuario_nuevo', id: codigo._id });
    }

    if (!usuario.isActive) {
      return res.status(200).json({ ok: false, message: appMessages.general.deactived_account });
    }

    await client.messages.create({
      to: `+56${body.telefono}`,
      from: '+56931402276',
      body: `Tu codigo MoviApp es: ${code}. Valido por 2 minutos.`
    });

    res.status(200).json({ ok: true, tipo: 'usuario_registrado', id: codigo._id });
  },

  signInRiders: async (req, res, next) => {

    const body = req.body;

    const usuario = await Usuario.findOne({ telefono: body.telefono, role: 'RIDER_ROLE' });

    if (!usuario) {
      return res.status(200).json({ ok: false, message: appMessages.general.invalid_auth_credentials });
    }

    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(200).json({ ok: false, message: appMessages.general.invalid_auth_credentials });
    }

    if (!usuario.isActive) {
      return res.status(200).json({ ok: false, message: appMessages.general.deactived_account });
    }

    const token = signToken(usuario._id, body.role);
    res.status(200).json({ ok: true, token, usuario });
  },

  signInEmail: async (req, res, next) => {

    const body = req.body;

    const usuario = await Usuario.findOne({ email: body.email });

    if (!usuario) {
      return res.status(200).json({ ok: false, message: appMessages.general.invalid_auth_credentials });
    }

    if (body.from == 'dashboard-app' && usuario.role != 'ADMIN_ROLE') {
      return res.status(200).json({ ok: false, message: appMessages.admin.denied_access });
    }

    if (body.from == 'moviapp-web' && usuario.role != 'EMPRESA_ROLE') {
      return res.status(200).json({ ok: false, message: appMessages.admin.denied_access });
    }

    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(200).json({ ok: false, message: appMessages.general.invalid_auth_credentials });
    }

    if (!usuario.isActive) {
      return res.status(200).json({ ok: false, message: appMessages.general.deactived_account });
    }

    const token = signToken(usuario._id, usuario.role);
    res.status(200).json({ ok: true, token, usuario });
  },

  getOne: async (req, res, next) => {
    const version = req.headers.version;
    const id = req.query.id;
    const usuario = await Usuario.findById(id);
    res.status(200).json(usuario);
  },

  lastLogin: async (req, res, next) => {
    const id = req.query.id;
    const time = new Date().getTime();
    await Usuario.findByIdAndUpdate(id, { last_login: time, estado_cambiado: false });
    res.status(200).json({});
  },

  update: async (req, res, next) => {
    const id = req.query.id;
    const body = req.body;
    const data = await Usuario.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({ ok: true, data });
  },

  updatePassword: async (req, res, next) => {

    const id = req.query.id;
    const body = req.body;
    const usuario = await Usuario.findById(id);

    if (!bcrypt.compareSync(body.oldPassword, usuario.password)) {
      return res.status(200).json({ ok: false, message: appMessages.general.invalid_auth_credentials });
    }

    usuario.password = bcrypt.hashSync(body.newPassword, 10);

    const data = await Usuario.findByIdAndUpdate(id, usuario, { new: true });

    res.status(200).json({ ok: true, data });
  }

}