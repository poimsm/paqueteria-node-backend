let calcular_cobertura = (coors) => {

    const radio_santiago = 70000;
    const radio_la_serena_coquimbo = 15000;
    const radio_valdivia = 15000;

    const santiago = [-33.444012, -70.653651];
    const la_serena_coquimbo = [-29.948767, -71.292337];
    const valdivia = [-39.819996, -73.239510];

    const delta_santiago = this.haversineDistance(coors, santiago);
    const delta_la_serena_coquimbo = this.haversineDistance(coors, la_serena_coquimbo);
    const delta_valdivia = this.haversineDistance(coors, valdivia);

    let flag_santiago = false;
    let flag_la_serena_coquimbo = false;
    let flag_valdivia = false;

    if (delta_santiago < radio_santiago) {
        flag_santiago = true;
    }

    if (delta_la_serena_coquimbo < radio_la_serena_coquimbo) {
        flag_la_serena_coquimbo = true;
    }

    if (delta_valdivia < radio_valdivia) {
        flag_valdivia = true;
    }

    if (flag_santiago || flag_la_serena_coquimbo || flag_valdivia) {
        return { ok: true }
    } else {
        return { ok: false };
    }
}



let calcular_ciudad = (coors) => {

    const santiago = [-33.444012, -70.653651];
    const la_serena_coquimbo = [-29.948767, -71.292337];
    const valdivia = [-39.819996, -73.239510];

    const delta_santiago = this.haversineDistance(coors, santiago);
    const delta_la_serena_coquimbo = this.haversineDistance(coors, la_serena_coquimbo);
    const delta_valdivia = this.haversineDistance(coors, valdivia);

    const ciudades = [
        {
            value: 'santiago',
            delta: delta_santiago
        },
        {
            value: 'la_serena_coquimbo',
            delta: delta_la_serena_coquimbo
        },
        {
            value: 'valdivia',
            delta: delta_valdivia
        }
    ];

    let a = ciudades[0].delta;
    let b = 0;
    let id = ciudades[0].value;

    ciudades.forEach(ciudad => {
        b = ciudad.delta;
        if (b < a) {
            a = b;
            id = ciudad.value
        }
    });

    return id;
},

let toast_devolucion_paquete = async () => {
    const toast = await this.toastController.create({
        header: 'Te devolveremos el paquete en el punto de inicio',
        position: 'middle',
        duration: 15000,
        mode: 'md',
        buttons: [
            {
                text: 'Cerrar',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
    });

    toast.present();
}


