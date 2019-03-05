const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

router.get('/inicio', (req, res) => {
    res.render('pages/home', 
    {
        title: 'Página Inicial'
    });
});


module.exports = router;