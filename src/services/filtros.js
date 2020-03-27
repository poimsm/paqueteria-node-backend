module.exports = {
    clearRequestedList,
    filtro_zero,
    filtro_uno,
    filtro_dos
}

let requestedList = [
    {
        consumer: 'c1',
        riders: []
    },
    {
        consumer: 'c2',
        riders: []
    },
    {
        consumer: 'c3',
        riders: []
    }
];

let addRiderToRequestedList = (id, consumer) => {
    rejections.forEach(rejection => {
        if (rejection.consumer == consumer) {
            rejection.riders.push(id)
        }        
    });
}

let clearRequestedList = (consumer) => {
    rejections.forEach(rejection => {
        if (rejection.consumer == consumer) {
            rejection.riders = []
        }        
    });
}

let limpiar_riders_rechazados = async () => {

    if (this.riders_rechazados.length == 0) {
        return;
    }

    let promesas = [];

    this.riders_rechazados.forEach(id => {
        promesas.push(
            this.updateRider(id, 'rider', { rechazadoId: '' })
        )
    });

    await Promise.all(promesas);
    this.riders_rechazados = [];
}



let filtro_zero = (riders_db) => {

    const riders_disponibles = []; 

    if (riders_consultados.length == 0) {
        return riders_db;
    }

    riders_db.forEach(rider => {
        let flag = true;

        riders_consultados.forEach(id => {
            if (rider.rider == id) {
                flag = false;
            }
        });

        if (flag) {
            riders_disponibles.push(rider);
        }
    });

    return riders_disponibles;
}


let filtro_uno = (riders, lat, lng, vehiculo) => {

    if (riders.length == 0) {
        return { ok: false };
    }

    const riders_mod = { moto: [], bicicleta: [], auto: [] };

    let radio_de_busqueda = {
        moto: 10000,
        bicicleta: 2000,
        auto: 10000
    };

    riders.forEach(rider => {

        const riderCoors = [rider.lat, rider.lng];
        const destinoCoors = [lat, lng];

        const distance = haversineDistance(riderCoors, destinoCoors);

        if (distance < radio_de_busqueda[rider.vehiculo]) {
            riders_mod[rider.vehiculo].push(rider);
        }

    });

    if (!(riders_mod.moto.length > 0 || riders_mod.bicicleta.length > 0 || riders_mod.auto.length > 0)) {
        return { ok: false };
    }

    let id, vehiculo_res;

    if (vehiculo == 'moto') {
        if (riders_mod.moto.length > 0) {
            id = riders_loop(riders_mod.moto, lat, lng);
            vehiculo_res = 'moto';
        } else {
            if (riders_mod.auto.length > 0) {
                id = riders_loop(riders_mod.auto, lat, lng);
                vehiculo_res = 'auto';
            } else {
                id = riders_loop(riders_mod.bicicleta, lat, lng);
                vehiculo_res = 'bicicleta';
            }
        }
    }

    if (vehiculo == 'auto') {
        if (riders_mod.auto.length > 0) {
            id = riders_loop(riders_mod.auto, lat, lng);
            vehiculo_res = 'auto';
        } else {
            if (riders_mod.moto.length > 0) {
                id = riders_loop(riders_mod.moto, lat, lng);
                vehiculo_res = 'moto';
            } else {
                id = riders_loop(riders_mod.bicicleta, lat, lng);
                vehiculo_res = 'bicicleta';
            }
        }
    }

    if (vehiculo == 'bicicleta') {
        if (riders_mod.bicicleta.length > 0) {
            id = riders_loop(riders_mod.bicicleta, lat, lng);
            vehiculo_res = 'bicicleta';
        } else {
            if (riders_mod.moto.length > 0) {
                id = riders_loop(riders_mod.moto, lat, lng);
                vehiculo_res = 'moto';
            } else {
                id = riders_loop(riders_mod.auto, lat, lng);
                vehiculo_res = 'auto';
            }
        }
    }

    return { ok: true, id, vehiculo: vehiculo_res };
}

let add_riders = (riders, orden) => {
    let res = [];

    orden.forEach(vehiculo => {
        riders[vehiculo].forEach((rider, i) => {
            if (i < 2) {
                res.push(rider);
            }
        });
    });

    return res;
}

let filtro_dos = (riders, lat, lng) => {

    const riders_moto = [];
    const riders_bici = [];
    const riders_auto = [];

    let isMoto = false;
    let isBici = false;
    let isAuto = false;

    riders.forEach(rider => {
        const riderCoors = [rider.lat, rider.lng];
        const destinoCoors = [lat, lng];

        const distance = haversineDistance(riderCoors, destinoCoors);

        if (distance < 6000 && rider.vehiculo == 'moto') {
            riders_moto.push(rider);
        }

        if (distance < 3000 && rider.vehiculo == 'bicicleta') {
            riders_bici.push(rider);
        }

        if (distance < 6000 && rider.vehiculo == 'auto') {
            riders_auto.push(rider);
        }
    });

    if (riders_moto.length > 0) {
        isMoto = true;
    }

    if (riders_bici.length > 0) {
        isBici = true;
    }

    if (riders_auto.length > 0) {
        isAuto = true;
    }

    return { isMoto, isBici, isAuto };
}

let riders_loop = (riders, lat, lng) => {
    const distanceMatrix = [];

    riders.forEach(rider => {

        let distance = 0;

        distance = Math.sqrt((rider.lat - lat) * (rider.lat - lat) + (rider.lng - lng) * (rider.lng - lng));

        distanceMatrix.push({
            distance,
            id: rider.rider
        });
    });

    let a = distanceMatrix[0].distance;
    let id = distanceMatrix[0].id;
    let b = 0;

    distanceMatrix.forEach(item => {
        b = item.distance;
        if (b < a) {
            a = b;
            id = item.id;
        }
    });

    return id;
}

let haversineDistance = (coords1, coords2) => {

    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lat1 = coords1[0];
    var lon1 = coords1[1];

    var lat2 = coords2[0];
    var lon2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    d = d * 1000;

    return d;
}
