const express = module.require('express');
const router = express.Router();
const puppeteer = module.require('puppeteer');

const middleware = module.require('../middlewares/middleware');

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
        /*
        TODO:
          if (it's a valid cpf)
          {
              if (cpf is in database)
              {
                  if (password match)
                  {
                      ... login
                  }
                  else
                  {
                      try again
                  }
              }
              else
              {
                puppeteer...
              }
          }
          else
          {
              return error
          }
        */
        (async () => {
            const browser = await puppeteer.launch();

            const page = await browser.newPage();
            await page.goto('https://sistemas.ufal.br/academico/login.seam');

            await page.type('[id="loginForm:username"]', req.body.username);
            await page.type('[id="loginForm:password"]', req.body.password);
            await page.click('[id="loginForm:entrar"]');

            var url = page.url().split('?');

            if (url.length > 1) {
                var cid = url[1].split('=');

                await page.goto(`https://sistemas.ufal.br/academico/matricula/visualizar.seam?cid=${cid[1]}`);
                await page.screenshot({
                    path: 'screenshot.png'
                });

                await browser.close();

                var newUser = new User({
                    username: req.body.username,
                    password: req.body.password,
                    name: 'teste',
                    registration: '0000'
                });

                User.createUser(newUser, (err, user) => {
                    // TODO: Erro de criar usuário
                    if (err) throw err;
                });

                res.status(200).send({
                    response: 'user exists and was registered'
                });
            } else {
                await browser.close();
                res.status(404).send({
                    error: 'user does not exists'
                });
            }

        })();
    }
});

module.exports = router;
