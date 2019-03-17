const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');
const User = module.require('../../models/user');
const Ticket = module.require('../../models/ticket');

router.all('/*', middleware.proceedIfAuthenticated);

router.get('/', (req, res) => {
    Intolerance.getManyBut(req.user.intolerances, (err, intolerances) => {
        if (err) throw err;
        Ticket.getByUserID(req.user.id, (err2, tickets) => {
            if (err2) throw err2;

            res.render('pages/profile', {
                title: 'Meu Perfil',
                intolerances: intolerances,
                tickets: tickets
            });
        });
    })
});

router.get('/tickets', (req, res) => {
    Ticket.getByUserID(req.user.id, (err, tickets) => {
        res.json(tickets);
    });
});

router.post('/intolerances/update', (req, res) => {
    Intolerance.getMany(req.body.intolerances, (err, intolerances) => {
        if (err) throw err;

        User.updateIntolerances(req.user.id, intolerances, (err2, affected, response) => {
            if (err2) throw err2;
            res.redirect('/user');
        });
    });
});

router.post('/wallet/update', middleware.validateWalletCash, (req, res) => {
    User.addMoneyToWallet(req.user.id, req.body.amount, (err, affected, response) => {
        if (err) throw err;
        req.flash('alerts', [{
            param: 'user-wallet',
            msg: `R$ ${req.body.amount} Adicionados à sua carteira`,
            type: 'success'
        }]);
        res.redirect('/user');
    });
});

module.exports = router;