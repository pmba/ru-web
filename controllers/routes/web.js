const express = module.require('express');
const router  = express.Router();

const middleware = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');

router.get('/inicio', (req, res) => {
    res.render('pages/home', 
    {
        title: 'Página Inicial'
    });
});

module.exports = router;