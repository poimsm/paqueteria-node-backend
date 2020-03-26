const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// default options
app.use(fileUpload());

uploader = (path) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(path, function (result) {

            let a = result.url.split('http://')[0];
            let b = result.url.split('http://')[1];
            a = 'https://';

            let url = a + b;

            const image = {
                url,
                id: result.public_id
            };
            resolve(image);
        });
    })
}


app.post('/upload', function (req, res) {

    const archivo = req.files.image;

    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    let nombreArchivo = `${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${nombreArchivo}`, (err) => {

        if (err) {
            borraArchivo(nombreArchivo);
            return res.status(200).json({ ok: false, err: 'Error con la carpeta Uploads' });
        }

        const pathImagen = path.resolve(__dirname, `../../../uploads/${nombreArchivo}`);
        uploader(pathImagen)
            .then(image => {
                borraArchivo(nombreArchivo);
                res.status(200).json({ ok: true, image });
            })
            .catch(err => {
                borraArchivo(nombreArchivo);
                res.status(200).json({ ok: false, err: 'Error con Cloudinary' });
            });
    });

});


function borraArchivo(nombreImagen) {

    let pathImagen = path.resolve(__dirname, `../../../uploads/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;