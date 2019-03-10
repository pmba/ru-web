const express = module.require('express');
const router = express.Router();
const bcrypt = module.require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const middleware = module.require('../middlewares/middleware');
const puppeteer = module.require('../middlewares/puppeteer');

const User = module.require('../../models/user');


router.get('/', middleware.proceedIfNotAuthenticated, (req, res) => {
    res.render('pages/auth', {
        title: 'Autenticação'
    });
});

router.post('/', middleware.proceedIfNotAuthenticated, middleware.validation, (req, res, next) => {
    var errors = req.validationErrors();

    if (errors) {
        req.flash('alerts', errors);
        res.redirect('/auth');
    } else {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                // if not user execute puppeteer function
                (async () => {
                    //Start puppeteer
                    user = await puppeteerDataCollection(req, res, next);
                    
                    // User was created, try to login with the new user

                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Redirect if it succeeds
                        req.flash('alerts', [
                            {param: 'user', msg: 'Você está logado', type: 'success'}
                        ]);
    
                        res.redirect('/inicio');
                    });
                })();
            } else {
                // if user
                if (info.status == 401) {
                    // Incorrect Password
                    
                    req.flash('alerts', [
                        { param: 'user', msg: 'Login ou Senha incorretos' }
                    ]);
    
                    res.redirect('/auth');
                } else if (info.status == 200) {
                    // Senha correta
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Redirect if it succeeds
                        req.flash('alerts', [
                            {param: 'user', msg: 'Você está logado', type: 'success'}
                        ]);
    
                        res.redirect('/inicio');
                    });
                }
            }

            
        })(req, res, next);
    }
});

router.get('/logout', middleware.proceedIfAuthenticated, (req, res) => {
    req.logout();

    req.flash('alerts', [
        {param: 'user', msg: 'Você está deslogado', type: 'success'}
    ]);

    return res.redirect('/inicio');
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if (err) {
                // Fazer alguma coisa?
                throw err;
            }

            if (!user) {
                return done(null, false, {
                    status: 404
                });
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user, {
                        status: 200
                    });
                } else {
                    return done(null, user, {
                        status: 401
                    });
                }
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

async function puppeteerDataCollection(req, res, next) {
    var newUser = await puppeteer.collectData(req.body.username, req.body.password);

    if (newUser != null) {
        User.createUser(newUser, (err, user) => {
            // TODO: Erro de criar usuário
            if (err) {
                req.flash('alerts', [
                    { param: 'user', msg: 'Não foi possível fazer login em sua conta, tente novamente em instantes', type: 'warning' }
                ]);

                res.redirect('/auth');
            }

            newUser = user;
        });
    } else {
        req.flash('alerts', [
            { param: 'user', msg: 'Login ou Senha incorretos' }
        ]);

        res.redirect('/auth');  
    }

    return newUser;
}


module.exports = router;