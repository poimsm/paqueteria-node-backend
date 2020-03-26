const jwt = require("jsonwebtoken");


let verificaToken = (req, res, next) => {

    const token = req.headers.token;

    if (!token) return res.status(401).send("Acceso denegado. No se proporciona token.");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(400).send("Token no válido.");
        }

        req.uid = decoded.uid;
        req.role = decoded.role;
        next();
    });
};

let verificaPhone = (req, res, next) => {

    const token = req.body.token;
    const telefono = req.body.telefono;


    if (!token) return res.status(401).send("Acceso denegado. No se proporciona token.");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(200).json({ ok: false });
        }

        if (telefono != decoded.phone) {
            return res.status(200).json({ ok: false });
        }

        next();
    });
};

module.exports = {
    verificaToken,
    verificaPhone
}

