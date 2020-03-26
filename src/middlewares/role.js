let verificaAdmin = (req, res, next) => {

    if (req.role == 'ADMIN_ROLE') {
        next();
    } else {
        res.status(401).send("Acceso denegado. No tiene permisos de ADMIN.");
    }
};

module.exports = {
    verificaAdmin
}

