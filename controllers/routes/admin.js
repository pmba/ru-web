const express = module.require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const adminMiddleware = module.require('../middlewares/admin');

const Intolerance = module.require('../../models/intolerance');
const User = module.require('../../models/user');
const Admin = module.require('../../models/admin');
const Ticket = module.require('../../models/ticket');
const Dish = module.require('../../models/dish');
const Menu = module.require('../../models/menu');
const DailyMenu = module.require('../../models/menu').DailyMenuSchema;

var dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

router.get('/profile', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.getAll((intoleranceError, intolerances) => {
        if (intoleranceError) throw intoleranceError;

        User.getAll('-password', (userError, users) => {
            if (userError) throw userError;

            Admin.getAll('-password', (adminsError, admins) => {
                if (adminsError) throw adminsError;

                Dish.getAll((dishError, dishes) => {
                    if (dishError) throw dishError;

                    Menu.getAll((menuError, menus) => {
                        if (menuError) throw menuError;

                        res.render('pages/admin/profile', {
                            title: 'Perfil Administração',
                            intolerances: intolerances,
                            ruUsers: users,
                            admins: admins,
                            dishes: dishes,
                            menus: menus
                        });

                    });
                });
            });
        });
    });

});

/* Intolerances Group */

router.get('/intolerances/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    res.render('pages/admin/intolerances/new', {
        title: 'Adicionar Intolerância'
    });
});

router.get('/intolerances/edit/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.findById(req.params.id, (err, intolerance) => {
        if (err) throw err;

        res.render('pages/admin/intolerances/edit', {
            title: 'Editar Intolerância',
            intolerance: intolerance
        });
    });
});

router.post('/intolerances/new', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateIntoleranceCreation, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect('/admin/intolerances/new');
    } else {
        var newIntolerance = new Intolerance({
            food: req.body.food,
        });

        Intolerance.createIntolerance(newIntolerance, (err, intolerance) => {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    req.flash('alerts', [{
                        param: 'intolerance',
                        msg: `Intolerância ${req.body.food} já existe`,
                        type: 'danger'
                    }]);

                    res.redirect('/admin/intolerances/new');
                }
            } else {
                req.flash('alerts', [{
                    param: 'intolerance',
                    msg: `Intolerância "${req.body.food}" criada com sucesso`,
                    type: 'success'
                }]);

                res.redirect('/admin/profile');
            }
        });
    }
});

router.put('/intolerances/edit/:id', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateIntoleranceCreation, (req, res) => {
    var updatedIntolerance = new Intolerance({
        food: req.body.food
    });
    Intolerance.updateIntoleranceById(req.params.id, updatedIntolerance, (err, resultIntolerance) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'intolerance',
            msg: `Intolerância "${req.body.food}" atualizada com sucesso`,
            type: 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

router.delete('/intolerances/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.deleteIntoleranceById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'intolerance',
            msg: `Intolerância deletada com sucesso`,
            type: 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

/* Admin Group */

router.get('/admins/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    res.render('pages/admin/admins/new', {
        title: 'Criar Novo Administrador'
    });
});

router.post('/admins/new', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateAdminCreation, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect('/admin/admins/new');
    } else {
        var newAdmin = new Admin({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });

        Admin.createUser(newAdmin, (err, admin) => {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    req.flash('alerts', [{
                        param: 'new-admin',
                        msg: 'Nome de Usuário não está disponível',
                        type: 'danger'
                    }]);

                    res.redirect('/admin/admins/new');
                }
            } else {
                req.flash('alerts', [{
                    param: 'new-admin',
                    msg: 'Novo Administrador registrado com sucesso',
                    type: 'success'
                }]);

                res.redirect('/admin/profile');
            }
        });
    }
});

router.get('/admins/edit/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Admin.getUserById(req.params.id, (err, admin) => {
        if (err) throw err;

        res.render('pages/admin/admins/edit', {
            title: 'Editar Administrador',
            admin: admin
        });
    });
});

router.put('/admins/edit/:id', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateAdminEdition, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect(`/admin/admins/edit/${req.params.id}`);
    } else {
        var modifiedAdmin = new Admin({
            name: req.body.name,
            username: req.body.username,
            role: req.body.role,
            password: req.body.password
        });

        Admin.updateUserById(req.params.id, req.body.passwordWillChange, modifiedAdmin, (err, adminChanges) => {
            if (err) throw err;

            req.flash('alerts', [{
                param: 'admin',
                msg: 'Administrador(a) modificado(a) com sucesso',
                type: 'success'
            }]);

            res.redirect('/admin/profile');
        });
    }
});

router.delete('/admins/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Admin.deleteUserById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'Admin',
            msg: `Administrador(a) deletado(a) com sucesso`,
            type: 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

/* Validation Group */

router.get('/validation', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    res.render('pages/admin/validation', {
        title: 'Validação'
    });
});

router.post('/validation', (req, res) => {

    Ticket.getById(req.body.id, (err, ticket) => {
        if (err) res.status(404).send('Ocorreu um erro ao tentar validar, tente novamente.')

        if (ticket) {
            if (ticket.validation.status === false) {
                Ticket.validateTicket(ticket._id, (err2, affected, response) => {

                    if (err2) throw err2;
                    else {
                        res.status(200).json({
                            name        : ticket.user_info.name,
                            registration: ticket.user_info.registration,
                            value       : ticket.value
                        });
                    }
                });
            } else {
                res.status(404).send('ticket ja validado.');
            }

        } else {
            res.status(404).send('ticket inválido');
        }
    });
});

/* Dishes Group */

router.get('/dishes/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.getAll((err, intolerances) => {
        if (err) throw err;

        res.render('pages/admin/dishes/new', {
            title: 'Cadastro de Prato',
            intolerances: intolerances
        });
    });
});

router.post('/dishes/new', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateDishCreation, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect('/admin/dishes/new');
    } else {
        var newDish = new Dish({
            name: req.body.name,
            intolerances: req.body.intolerances,
            type: req.body.type
        });

        Dish.createDish(newDish, (dishErr, dish) => {
            if (dishErr) throw dishErr;

            req.flash('alerts', [{
                param: 'new-dish',
                msg: `Prato ${newDish.name} criado com sucesso`,
                type: 'success'
            }]);

            res.redirect('/admin/profile');
        });
    }
});

router.get('/dishes/edit/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Dish.getDishById(req.params.id, (dishErr, dish) => {
        if (dishErr) throw dishErr;

        Intolerance.getMany(dish.intolerances, (dishIntoleranceErr, dishIntolerances) => {
            if (dishIntoleranceErr) throw dishIntoleranceErr;

            Intolerance.getManyButByNames(dish.intolerances, (notDishIntolerancesErr, notDishIntolerances) => {
                if (notDishIntolerancesErr) throw notDishIntolerancesErr;

                res.render('pages/admin/dishes/edit', {
                    title: 'Editar Prato',
                    dish: dish,
                    notDishIntolerances: notDishIntolerances,
                    dishIntolerances: dishIntolerances
                });
            });
        });
    });
});

router.put('/dishes/edit/:id', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateDishCreation, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect('/admin/dishes/new');
    } else {
        var modifiedDish = new Dish({
            name: req.body.name,
            intolerances: req.body.intolerances,
            type: req.body.type
        });

        Dish.updateDishById(req.params.id, modifiedDish, (err, updatedDish) => {
            if (err) throw err;

            req.flash('alerts', [{
                param: 'dish',
                msg: `Prato atualizado com sucesso`,
                type: 'success'
            }]);

            res.redirect('/admin/profile');
        });
    }
});

router.delete('/dishes/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Dish.deleteDishById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'dish',
            msg: `Prato deletado com sucesso`,
            type: 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

/* Menu Group */

router.get('/menu/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Dish.getByType('Carnívoro', (meatErr, meat) => {
        if (meatErr) throw meatErr;

        Dish.getByType('Vegetariano', (vegErr, veg) => {
            if (vegErr) throw vegErr;

            Dish.getByType('Acompanhamento', (sideDishErr, sideDish) => {
                if (sideDishErr) throw sideDishErr;

                Dish.getByType('Sobremesa', (dessertErr, dessert) => {
                    if (dessertErr) throw dessertErr;

                    Dish.getByType('Bebida', (drinkErr, drink) => {
                        if (drinkErr) throw drinkErr;

                        res.render('pages/admin/menu/new', {
                            title: 'Cadastro de Menu',
                            meats: meat,
                            vegetarians: veg,
                            sideDishes: sideDish,
                            desserts: dessert,
                            drinks: drink
                        });
                    });
                });
            });
        });
    });
});

router.get('/menu/new/success', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    req.flash('alerts', [{
        param: 'menu',
        msg: `Cardápio Semanal criado com sucesso`,
        type: 'success'
    }]);

    res.redirect('/admin/profile');
});

router.post('/menu/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    var DailyMenuArray = [];
    var week, weekIsDone = 0;

    const start = async () => {
        console.log(`[${Date.now()}] NEW MENU CREATION`);

        // return res.json(req.body.days[1].lunch.meat);

        await asyncForEach(req.body.days, async (day) => {

            let newDailyMenu = await new DailyMenu();
            let currentDate = new Date(day.date);

            if (weekIsDone == 0) {
                week = currentDate.getWeek();
                weekIsDone = 1;
            }

            newDailyMenu.date.name = await dayNames[currentDate.getDay()];
            newDailyMenu.date.day = await currentDate.getDate();
            newDailyMenu.date.month = await currentDate.getMonth() + 1;
            newDailyMenu.date.year = await currentDate.getFullYear();

            console.log(`\t[${Date.now()}] ${currentDate}`);

            if (typeof day.lunch != "undefined") {
                if (typeof day.lunch.meat != "undefined") {
                    newDailyMenu.lunch.meat = day.lunch.meat;
                }
                if (typeof day.lunch.vegetarian != "undefined") {
                    newDailyMenu.lunch.vegetarian = day.lunch.vegetarian;
                }
                if (typeof day.lunch.sideDish != "undefined") {
                    newDailyMenu.lunch.sideDish = day.lunch.sideDish;
                }
                if (typeof day.lunch.dessert != "undefined") {
                    newDailyMenu.lunch.dessert = day.lunch.dessert;
                }
                if (typeof day.lunch.drinks != "undefined") {
                    newDailyMenu.lunch.drinks = day.lunch.drinks;
                }
            }

            if (typeof day.dinner != "undefined") {
                if (typeof day.dinner.meat != "undefined") {
                    newDailyMenu.dinner.meat = day.dinner.meat;
                }
                if (typeof day.dinner.vegetarian != "undefined") {
                    newDailyMenu.dinner.vegetarian = day.dinner.vegetarian;
                }
                if (typeof day.dinner.sideDish != "undefined") {
                    newDailyMenu.dinner.sideDish = day.dinner.sideDish;
                }
                if (typeof day.dinner.dessert != "undefined") {
                    newDailyMenu.dinner.dessert = day.dinner.dessert;
                }
                if (typeof day.dinner.drinks != "undefined") {
                    newDailyMenu.dinner.drinks = day.dinner.drinks;
                }
            }

            await DailyMenuArray.push(newDailyMenu);
        });

        let newMenu = await new Menu.MenuSchema({
            date: {
                day: DailyMenuArray[0].date.day,
                month: DailyMenuArray[0].date.month,
                year: DailyMenuArray[0].date.year,
                week: week
            },
            days: DailyMenuArray
        });

        Menu.createMenu(newMenu, (err, menu) => {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    res.status(404).send('Já existe um cardápio cadastrado para a semana selecionada');
                } else {
                    throw err;
                }
            } else {
                res.status(200).send('/admin/menu/new/success');
            }
        });
    }

    start();
});

router.delete('/menu/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Menu.deleteMenuById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'menu',
            msg: `Cardápio Semanal deletado com sucesso `,
            type: 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

/* Authentication Group */

router.get('/login', adminMiddleware.proceedIfNotAuthenticated, (req, res) => {
    res.render('pages/admin/login', {
        title: 'Login Administração'
    });
});

router.post('/login', adminMiddleware.proceedIfNotAuthenticated, (req, res, next) => {
    passport.authenticate('admin', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('alerts', [{
                param: 'user',
                msg: 'Login ou Senha incorretos'
            }]);

            res.redirect('/admin/login');
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                // Redirect if it succeeds

                res.redirect('/admin/profile');
            });
        }
    })(req, res, next);
});

router.get('/logout', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    req.logout();

    req.flash('alerts', [{
        param: 'user',
        msg: 'Você está deslogado',
        type: 'success'
    }]);

    return res.redirect('/admin/login');
});

/* ............................................................................. */

module.exports = router;

passport.use('admin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
    },
    (username, password, done) => {
        Admin.getUserByUsername(username, (err, user) => {
            if (err) {
                // Fazer alguma coisa?
                throw err;
            }

            if (!user) {
                return done(null, false);
            }

            Admin.comparePassword(password, user.password, (err2, isMatch) => {

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
