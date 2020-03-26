const { Router } = require('express');
const router = Router();

let arr = [];

router.get('/hello', (req, res) => {
    arr.push('hola')
    console.log(arr)
    res.json({ message: 'hola campeon' })
})

module.exports = router;