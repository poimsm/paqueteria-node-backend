const RiderLocation = require('../models/panda-rider-localizacion');
const Rider = require('../models/panda-rider');

const OCUPADO = 0;
const DISPONIBLE = 1;

let getRidersCollection = () => {

    let query = {
        isOnline: true,
        ciudad: 'santiago',
        isActive: true,
        pagoPendiente: false,
        actividad: DISPONIBLE
    }

    return Rider.find(query);
}

let getRider = (id) => {
    return Rider.findOne({ rider: id });
}

let updateRider = (id, tipo, data) => {
    if (tipo == 'coors') {
        return this.db.doc(this._config.path_coors + id).update(data);
    }
    if (tipo == 'rider') {
        return this.db.doc(this._config.path_riders + id).update(data);
    }
}
