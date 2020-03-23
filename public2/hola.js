const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

socket.on('connect', () => {
  console.log('Successfully connected!');
});

console.log('HOOLA')