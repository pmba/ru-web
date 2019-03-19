const express = module.require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const adminMiddleware = module.require('../middlewares/admin');

const Intolerance = module.require('../../models/intolerance');
const Admin = module.require('../../models/admin');
const Ticket = module.require('../../models/ticket');

router.all('/*', (req, res, next) => {
    req.flash('profile_link', '/admin/profile');
    next();
});

router.get('/profile', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    res.render('pages/admin/profile',
    {
        title: 'Perfil Administração'
    });
});

router.get('/validation', adminMiddleware.proceedIfAuthenticated ,(req, res) => {
    res.render('pages/admin/validation',
    {
        title: 'Validação'
    });
});

router.get('/login', adminMiddleware.proceedIfNotAuthenticated, (req, res) => {
    res.render('pages/admin/login', 
    {
        title: 'Login Administração'
    });
});

router.get('/create', (req, res) => {
    var newAdmin = new Admin({
        username: 'ruadmin2019',
        password:'ru2019admin',
        role: -1
    });
    
    Admin.createUser(newAdmin, (err, admin) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                res.send('Usuário já existe');
            }
        } else {
            res.json(admin);
        }
    });
});

router.post('/login', adminMiddleware.proceedIfNotAuthenticated, (req, res, next) => {
    passport.authenticate('admin', function(err, user) {
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
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                // Redirect if it succeeds

                res.redirect('/admin/profile');
            });
        }
    })(req, res, next);
});

router.post('/validation', adminMiddleware.proceedIfAuthenticated, (req, res) => {
    Ticket.getById(req.body.id, (err, ticket) => {
        if (err) res.status(404).send('Ocorreu um erro ao tentar validar, tente novamente.')

        if (ticket) {
            res.status(200).json({
                name: ticket.user_info.name,
                registration: ticket.user_info.registration,
                value: ticket.value
            });
        } else {
            res.status(404).send('ticket inválido');
        }
    });
});

module.exports = router;

passport.use('admin', new LocalStrategy(
    {
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