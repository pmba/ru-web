const express       = module.require('express');
const router        = express.Router();
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const adminMiddleware = module.require('../middlewares/admin');

const Intolerance = module.require('../../models/intolerance');
const User        = module.require('../../models/user');
const Admin       = module.require('../../models/admin');
const Ticket      = module.require('../../models/ticket');
const Dish        = module.require('../../models/dish');

router.all('/*', (req, res, next) => {
    res.locals.profile_link = '/admin/profile';
    res.locals.logout_link = '/admin/logout';
    
    next();
});

router.get('/profile', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.getAll((intoleranceError, intolerances) => {
        if (intoleranceError) throw intoleranceError;

        User.getAll('-password', (userError, users) => {
            if (userError) throw userError;

            Admin.getAll('-password', (adminsError, admins) => {
                if (adminsError) throw adminsError;

                Dish.getAll((dishError, dishes) => {
                    if (dishError) throw dishError;

                    res.render('pages/admin/profile', {
                        title       : 'Perfil Administração',
                        intolerances: intolerances,
                        ruUsers     : users,
                        admins      : admins,
                        dishes      : dishes
                    });
                });
            });
        });
    });

});

/* Intolerances Group */

router.get('/intolerances/new', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    res.render('pages/admin/intolerances/new', {
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
            food         : req.body.food,
            contamination: req.body.contamination
        });

        Intolerance.createIntolerance(newIntolerance, (err, intolerance) => {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    req.flash('alerts', [{
                        param: 'intolerance',
                        msg  : `Intolerância ${req.body.food} já existe`,
                        type : 'danger'
                    }]);

                    res.redirect('/admin/intolerances/new');
                }
            } else {
                req.flash('alerts', [{
                    param: 'intolerance',
                    msg  : `Intolerância "${req.body.food}" criada com sucesso`,
                    type : 'success'
                }]);

                res.redirect('/admin/profile');
            }
        });
    }
});

router.put('/intolerances/edit/:id', adminMiddleware.proceedIfAuthenticated, adminMiddleware.validateIntoleranceCreation, (req, res) => {
    var updatedIntolerance = new Intolerance({
        food: req.body.food,
        contamination: req.body.contamination
    });
    Intolerance.updateIntoleranceById(req.params.id, updatedIntolerance, (err, resultIntolerance) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'intolerance',
            msg  : `Intolerância "${req.body.food}" atualizada com sucesso`,
            type : 'success'
        }]);

        res.redirect('/admin/profile');
    });
});

router.delete('/intolerances/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Intolerance.deleteIntoleranceById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'intolerance',
            msg  : `Intolerância deletada com sucesso`,
            type : 'success'
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
            name    : req.body.name,
            username: req.body.username,
            password: req.body.password,
            role    : req.body.role
        });

        Admin.createUser(newAdmin, (err, admin) => {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    req.flash('alerts', [{
                        param: 'new-admin',
                        msg  : 'Nome de Usuário não está disponível',
                        type : 'danger'
                    }]);

                    res.redirect('/admin/admins/new');
                }
            } else {
                req.flash('alerts', [{
                    param: 'new-admin',
                    msg  : 'Novo Administrador registrado com sucesso',
                    type : 'success'
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
                msg  : 'Administrador(a) modificado(a) com sucesso',
                type : 'success'
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
            msg  : `Administrador(a) deletado(a) com sucesso`,
            type : 'success'
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

router.post('/validation', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Ticket.getById(req.body.id, (err, ticket) => {
        if (err) res.status(404).send('Ocorreu um erro ao tentar validar, tente novamente.')

        if (ticket) {
            res.status(200).json({
                name        : ticket.user_info.name,
                registration: ticket.user_info.registration,
                value       : ticket.value
            });
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
            intolerances: req.body.intolerances
        });

        Dish.createDish(newDish, (dishErr, dish) => {
            if (dishErr) throw dishErr;

            req.flash('alerts', [{
                param: 'new-dish',
                msg  : `Prato ${newDish.name} criado com sucesso`,
                type : 'success'
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

router.delete('/dishes/delete/:id', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Dish.deleteDishById(req.params.id, (err) => {
        if (err) throw err;

        req.flash('alerts', [{
            param: 'dish',
            msg  : `Prato deletado com sucesso`,
            type : 'success'
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
                msg  : 'Login ou Senha incorretos'
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
        msg  : 'Você está deslogado',
        type : 'success'
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