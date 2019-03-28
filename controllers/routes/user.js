const express = module.require('express');
const router  = express.Router();

const middleware = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');
const User        = module.require('../../models/user');
const Ticket      = module.require('../../models/ticket');

router.all('/*', middleware.proceedIfAuthenticated);

router.get('/', (req, res) => {
    User.getUserWithoutPassword(req.user._id, (userErr, user) => {
        if (userErr) throw userErr;

        Intolerance.getManyBut(req.user.intolerances, (err, notIntolerances) => {
            if (err) throw err;
            Ticket.getByUserID(req.user._id, (err2, tickets) => {
                if (err2) throw err2;

                res.render('pages/profile', {
                    title       : 'Meu Perfil',
                    notIntolerances: notIntolerances,
                    user: user,
                    tickets     : tickets
                });
            });
        })
    });
});

router.get('/tickets', (req, res) => {
    Ticket.getByUserID(req.user._id, (err, tickets) => {
        res.json(tickets);
    });
});

router.post('/tickets/buy', middleware.validatePurchase, (req, res) => {

    const ticket = new Ticket({
        user_info: {
          name: req.user.name,
          id : req.user._id,
          registration: req.user.registration
        },
        value: req.body.amount
    });

    Ticket.createTicket(ticket, (err) => {
        if(err) throw err;

        User.updateWallet(req.user._id, req.body.amount*(-1), (err2, affected, response) => {
            if (err2) throw err2;

            req.flash('alerts', [{
                param: 'user-wallet',
                msg  : `R$ ${req.body.amount} Retirados da sua carteira`,
                type : 'success'
            }]);

            res.redirect('/user');
        });
    });
});

router.post('/intolerances/update', (req, res) => {
    Intolerance.getMany(req.body.intolerances, (err, intolerances) => {
        if (err) throw err;

        User.updateIntolerances(req.user._id, intolerances, (err2, affected, response) => {
            if (err2) throw err2;
            res.redirect('/user');
        });
    });
});

router.post('/wallet/update', middleware.validateWalletCash, (req, res) => {
    User.updateWallet(req.user._id, req.body.amount, (err, affected, response) => {
        if (err) throw err;
        req.flash('alerts', [{
            param: 'user-wallet',
            msg  : `R$ ${req.body.amount} Adicionados à sua carteira`,
            type : 'success'
        }]);

        res.redirect('/user');
    });
});

module.exports = router;
