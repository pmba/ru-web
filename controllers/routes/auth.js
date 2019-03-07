const express = module.require('express');
const router = express.Router();
const bcrypt = module.require('bcryptjs');

const middleware = module.require('../middlewares/middleware');
const puppeteer = module.require('../middlewares/puppeteer');

const User = module.require('../../models/user');

router.get('/registrar', (req, res) => {
    res.render('pages/register', {
        title: 'Registrar',
        errors: null
    });
});

router.post('/registrar', middleware.validation, (req, res) => {
    var errors = req.validationErrors();

    if (errors) {
        res.render('pages/register', {
            title: 'Registrar',
            errors: errors
        });

    } else {

        //Check if is a valid CPF
       if(middleware.cpfCheck(req.body.username)) {

            //Search cpf in database
            User.find({username: req.body.username}, async (err, user) => {
                if(err) throw err;

                //CPF is found
                if(user.length != 0) {

                    //Compare hash with password
                    bcrypt.compare(req.body.password, user[0].password, function(err, res) {
                        if(res) {
                            console.log("logged in");
                            //TODO: login
                        } else {
                            console.log("invalid password");
                            //TODO: tryagain
                        }
                    });

                //Create new user (CPF not found)
                } else {
                  (async () => {
                      //Start puppeteer
                      const newUser = await puppeteer.collectData(req.body.username, req.body.password);

                      if(newUser != null) {
                          User.createUser(newUser, (err, user) => {
                              // TODO: Erro de criar usuário
                              if (err) throw err;
                          });

                          res.status(200).send({
                              response: 'user exists and was registered'
                          });

                      } else {
                          res.status(404).send({
                              error: 'user does not exists'
                          });
                      }
                  })();
                }
            });

        } else {
            res.status(404).send({
                error: 'invalid cpf'
            });
        }
    }
});

module.exports = router;
