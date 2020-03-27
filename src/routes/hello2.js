const { Router } = require('express');
const router = Router();
const { hmm } = require('./setter');

// import hmm from './setter'

let arr = [];

router.get('/hello2', (req, res) => {
    arr.push('hola2')
    console.log(arr, 'arr2');
    hmm.set();
    res.json({ message: 'hola campeon2' })
});

module.exports = router;