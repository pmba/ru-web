const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

const Menu = module.require('../../models/menu');
const Dish = module.require('../../models/dish');

router.get('/inicio', (req, res) => {
    let currentWeek = new Date().getWeek();

    Menu.getMenuByWeek(currentWeek, (err, menu) => {
        if (err) throw err;

        res.render('pages/home', {
            title: 'Página Inicial',
            menu: menu
        });
    });
});

router.get('/pratos', (req, res) => {
    Dish.getAll((err, dishes) => {
        if (err) throw err;

        res.render('pages/dishes', {
            title: 'Pratos',
            dishes: dishes
        });
    });
});

module.exports = router;