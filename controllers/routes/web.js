const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');

router.get('/inicio', (req, res) => {
    res.render('pages/home', 
    {
        title: 'Página Inicial'
    });
});

router.post('/intolerance', (req, res) => {
    var newIntolerance = new Intolerance({
        food: 'Camarão',
        contamination: false
    });

    Intolerance.createIntolerance(newIntolerance, (err, Intolerance) => {
        if (err) throw err;

        res.send('ok');
    });
});


module.exports = router;