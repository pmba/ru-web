const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

const Menu = module.require('../../models/menu').MenuSchema;
const Dish = module.require('../../models/dish');

router.get('/', (req, res) => res.redirect('/inicio'));

router.get('/inicio', (req, res) => {
    let currentWeek = new Date(new Date().toLocaleDateString('pt-BR')).getWeek();

    Menu.findOne({'date.week': currentWeek})
        .populate([
            { path: 'days.lunch.meat', model: 'Dish' },
            { path: 'days.lunch.vegetarian', model: 'Dish' },
            { path: 'days.lunch.sideDish', model: 'Dish' },
            { path: 'days.lunch.dessert', model: 'Dish' },
            { path: 'days.lunch.drinks', model: 'Dish' },
            { path: 'days.dinner.meat', model: 'Dish' },
            { path: 'days.dinner.vegetarian', model: 'Dish' },
            { path: 'days.dinner.sideDish', model: 'Dish' },
            { path: 'days.dinner.dessert', model: 'Dish' },
            { path: 'days.dinner.drinks', model: 'Dish' },
        ])
        .exec((err, menu) => {
            if (err) throw err;

            res.render('pages/home', {
                title: 'Pratos',
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