const _filtros = require('./services/rider');
const _notificaciones = require('./services/rider');
const _rider = require('./services/rider');

module.exports = {
    searchRider
}

let state = [
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

let searchRider = (query, consumer) => {

    this._filtros.clearRequestedList = [];
    let promesa;
    let tries = 0;

    while (tries <= 5) {

        let res = await getNeerestRider(query);
        res.ok ? tries = 6 : tries++;
    }

    if (!res.ok)
        promesa = new Promise((resolve, reject) => resolve({ ok: false }));


    promesa = new Promise((resolve, reject) => {

        this.counter++;

        if (this.counter == 4) {
            this.loadingRider = false;
            this.counter = 0;
            return this.alert_alta_demanda();
        }



        if (!res.ok) {
            resolve({ ok: false });
        }

        getNeerestRider(query).then(res => {

            if (!res.ok) {
                return setTimeout(() => {
                    resolve({ ok: false })
                }, 5 * 1000);
            }

            this.vehiculo_alternativo = res.vehiculo;

            handShake(res.id);
            sleepRider(res.id);

            resolve({ ok: true });
        });
    });


    return promesa;
}


getNeerestRider(query).then(res => {

    if (!res.ok) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ ok: false })
            }, 5 * 1000);
        })
    }

    handShake(res.id);
    sleepRider(res.id);

    resolve({ ok: true });
});


let sleepRider = (id) => {
    this.timer = setTimeout(async () => {

        this._fire.riders_consultados.push(id);

        searchRider();

        this._fire.getRiderPromise(id).then(rider => {

            if (rider.pedidos_perdidos >= 1) {

                this._fire.updateRider(id, 'rider', {
                    cliente_activo: '',
                    pagoPendiente: false,
                    nuevaSolicitud: false,
                    isOnline: false,
                    pedidos_perdidos: 0
                });

                this._fire.updateRider(id, 'coors', {
                    pagoPendiente: false,
                    isOnline: false
                });
            } else {

                this._fire.updateRider(id, 'rider', {
                    cliente_activo: '',
                    pagoPendiente: false,
                    nuevaSolicitud: false,
                    pedidos_perdidos: rider.pedidos_perdidos + 1
                });

                this._fire.updateRider(id, 'coors', {
                    pagoPendiente: false
                });

            }
        });

    }, 5 * 1000);
}


let handShake = (id) => {
    this._fire.getRiderPromise(id).then(rider => {

        if (rider.cliente_activo == '') {
            this._fire.updateRider(id, 'rider', { cliente_activo: this.usuario._id })
                .then(() => this.handShake(id));
        }

        if (rider.cliente_activo != this.usuario._id && rider.cliente_activo != '') {
            getNeerestRider();
        }

        if (rider.cliente_activo == this.usuario._id && rider.cliente_activo != '') {
            sendRiderRequest(id);
        }
    });
}

let getNeerestRider = (query) => {

    const { vehiculo, ciudad, lat, lng } = query;

    return new Promise(async (resolve, reject) => {

        let riders = [];

        riders = await _rider.getRidersCollection({ ciudad, cliente_activo: '' });

        if (riders.length == 0) {
            return resolve({ isMoto: false, isBici: false, isAuto: false });
        }

        const riders_zero = _filtros.filtro_zero(riders);

        const data = _filtros.filtro_uno(riders_zero, lat, lng, vehiculo);

        if (!data.ok) {
            return resolve({ ok: false });
        }

        resolve({ ok: true, id: data.id, vehiculo: data.vehiculo });
    });
}


let sendRiderRequest = async (id) => {

    this._fire.riders_consultados.push(id);

    await this._fire.updateRider(id, 'rider', {
        nuevaSolicitud: true,
        pagoPendiente: true,
        created: new Date().getTime(),
        dataPedido: {
            cliente: {
                _id: this.usuario._id,
                nombre: this.usuario.nombre,
                img: this.usuario.img.url,
                role: this.usuario.role
            },
            pedido: {
                distancia: this.distancia,
                tiempo: this.tiempo,
                origen: this._control.origen,
                destino: this._control.destino,
                costo: this.precio
            }
        }
    });

    await this._fire.updateRider(id, 'coors', {
        pagoPendiente: true
    });

    this.subscribeToRider(id);
    this._fcm.sendPushNotification(id, 'nuevo-pedido');
}


let consumerSleep = () => {

}


let cancelarServicio = async (id, pedido) => {

    const rider: any = await this.getRiderPromise(id);

    if (rider.fase == 'navegando_al_origen') {

        const data_rider = {
            actividad: 'disponible',
            cliente_activo: '',
            pedido: '',
            servicio_cancelado: true
        };

        const data_coors = {
            actividad: 'disponible',
            cliente: ''
        };

        this.updateRider(id, 'rider', data_rider);
        this.updateRider(id, 'coors', data_coors);

        const bodyPedido = {
            pedido: pedido._id,
            rider: id
        };

        this._data.cancelarPedido(bodyPedido);
    }

    if (rider.fase != 'navegando_al_origen') {

        const data_rider = {
            bloqueado: true,
            servicio_cancelado: true
        };

        this.updateRider(id, 'rider', data_rider);
        this.toast_devolucion_paquete();

        const bodyPedido = {
            pedido: pedido._id,
            rider: id
        };

        this._data.cancelarPedido(bodyPedido);
    }
}

let detectarRidersCercanos = (body) => {
    return new Promise(async (resolve, reject) => {

        const { ciudad, lat, lng } = body;

        let riders: any = [];

        riders = await this.getRidersCollection(ciudad, 'disponible');

        if (riders.length == 0) {
            riders = await this.getRidersCollection(ciudad, 'ocupado');
        }

        if (riders.length == 0) {
            return resolve({ isMoto: false, isBici: false, isAuto: false });
        }

        const data = this.filtro_dos(riders, lat, lng);
        resolve({ isMoto: data.isMoto, isBici: data.isBici, isAuto: data.isAuto });
    });
}




let subscribeToRider = (id) => {
    this.riderSub$ = this._fire.getRider(id).subscribe(data => {
        const riderFire: any = data[0];
        this.riderActivoEnBusqueda = riderFire.rider;

        if (riderFire.rechazadoId == this.usuario._id) {
            clearTimeout(this.timer);
            this.riderSub$.unsubscribe();
            this._fire.updateRider(id, 'rider', { rechazadoId: '', cliente_activo: '' })
            this.getNeerestRider();
        }

        if (riderFire.aceptadoId == this.usuario._id) {

            this.tiempoLlegada = riderFire.tiempoLlegada;

            clearTimeout(this.timer);
            this.riderSub$.unsubscribe();
            this.loadingRider = false;

            this._data.getOneRider(riderFire.rider).then(rider => {

                this.rider = rider;

                const data = {
                    actividad: riderFire.actividad,
                    monto: this.precio,
                    monto_promo: this.precio_promo,
                    rider: this.rider,
                    usuario: this.usuario,
                    pedido: {
                        origen: this._control.origen,
                        destino: this._control.destino,
                        distancia: this.distancia,
                        tiempo: this.tiempo + this.tiempoLlegada
                    }
                }

                if (this.vehiculo != this.vehiculo_alternativo) {
                    this.presentAlternative(this.vehiculo, this.vehiculo_alternativo, data);
                } else {
                    this.openPayModal(data);
                }

            });
        }

    });
}

