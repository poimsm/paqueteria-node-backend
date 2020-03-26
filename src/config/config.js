//  Puerto
process.env.PORT = process.env.PORT || 3000;


//  Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';


//  Token
process.env.JWT_LONG_EXPIRATION = "360d";
process.env.JWT_SHORT_EXPIRATION = 2 * 60 * 1000;
process.env.JWT_SECRET = process.env.JWT_SECRET || "GhrVkhiaW5rhZTpTn1kyv7mz2IbNq22zxDwJ1D55";


//  MongoDB
let urlDB;

const urlMLabProd = 'mongodb://joopiter:lospri133@ds043987.mlab.com:43987/cafe-joopiter';
const urlMLabTest = 'mongodb://moviapp:lospri133@ds339458.mlab.com:39458/moviapp-test';

switch (process.env.NODE_ENV) {
  case 'DEV':
    urlDB = urlMLabTest;
    break;
  case 'PROD':
    urlDB = urlMLabProd;
    break;
}

process.env.URLDB = urlDB;

//  Cloudinary
process.env.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "ddon9fx1n";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "395786779988163";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "90RfpewtwL_oD9m9FsLuFS6Cf8k";

//  Twilio
process.env.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC10398816ed1ca40f1d51d6bfdb3563d1";
process.env.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "ac23f4d7d586ed847d232ac5157db061";

//  web push-notifications
process.env.PUBLIC_VAPID = "BB-Lgfvyrdf7S5RoLOs1hTfdjQP2kpuOSKBnh-sX76zh5qVanoL2wyviNjMZ7h3RkhhJzJl_qQ4IKlIKZfM7jug";
process.env.PRIVATE_VAPID = "klKvc5AmOAu99BaC9_1tNrRHN7ZVZFMFxpPPc4scK6E";