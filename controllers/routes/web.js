const express = module.require('express');
const router = express.Router();
const path = module.require('path');
const puppeteer = module.require('puppeteer');

const middleware = module.require('../middlewares/middleware');

router.use((req, res, next) => {
    console.log(`[${Date.now()}] ${req.method} ${req.originalUrl}`);
    next();
});

router.get('/inicio', (req, res) => {
    res.render('pages/home', 
    {
        title: 'Página Inicial'
    });
});

router.get('/registrar', (req, res) => {
    res.render('pages/register', 
    {
        title: 'Registrar'
    });
});

router.post('/registrar', middleware.checkUserData, (req, res) => {
    (async (username, password) => {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto('https://sistemas.ufal.br/academico/login.seam');

        await page.type('[id="loginForm:username"]', req.body.username);
        await page.type('[id="loginForm:password"]', req.body.password);
        await page.click('[id="loginForm:entrar"]');
        // await page.waitForNavigation();

        var url = page.url().split('?');

        await browser.close();

        if (url.length > 1) res.status(200).send({response: 'user exists'});
        else res.status(404).send({error: 'user does not exists'});
    })();
});

module.exports = router;