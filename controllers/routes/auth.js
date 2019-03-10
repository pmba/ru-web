const express = module.require('express');
const router = express.Router();
const bcrypt = module.require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const middleware = module.require('../middlewares/middleware');
const puppeteer = module.require('../middlewares/puppeteer');

const User = module.require('../../models/user');

router.get('/', (req, res) => {
    res.render('pages/auth', {
        title: 'Autenticação',
        errors: null
    });
});

router.post('/', middleware.validation, (req, res, next) => {
    var errors = req.validationErrors();

    if (errors) {
        console.log(`errors: ${errors}`);
        res.render('pages/auth', {
            title: 'Autenticação',
            errors: errors
        });
    } else {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                // console.log('nao tem usuario.');
                // Se não achar usuário, executa o resto da função
                (async () => {
                    //Start puppeteer
                    await puppeteerDataCollection(req, res, next);
                })();
            } else {
                // console.log('tem usuário');
                // Se achar usuário
                if (info.status == 401) {
                    // Senha incorreta
                    return res.render('pages/auth', {
                        title: 'Autenticação',
                        errors: [{
                            param: 'user',
                            msg: 'Login ou Senha incorretos'
                        }]
                    });
                } else if (info.status == 200) {
                    // Senha correta
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        // Redirect if it succeeds
                        return res.send('logado');
                    });
                }
            }
        })(req, res, next);
    }
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
    const newUser = await puppeteer.collectData(req.body.username, req.body.password);

    if (newUser != null) {
        User.createUser(newUser, (err, user) => {
            // TODO: Erro de criar usuário
            if (err) {
                res.render('pages/auth', {
                    title: 'Autenticação',
                    errors: [{
                        param: 'user',
                        msg: 'Não foi possível autenticar sua conta, por favor, tente novamente em alguns instantes',
                        type: 'warning'
                    }]
                });
            }
        });

        res.status(200).send({
            response: 'user exists and was registered'
        });

    } else {
        res.render('pages/auth', {
            title: 'Autenticação',
            errors: [{
                param: 'user',
                msg: 'Login ou Senha incorretos'
            }]
        });
    }
}


module.exports = router;