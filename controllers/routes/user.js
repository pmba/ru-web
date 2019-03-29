const express = module.require('express');
const router  = express.Router();

const middleware  = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');
const User        = module.require('../../models/user');
const Ticket      = module.require('../../models/ticket');
const Dish        = module.require('../../models/dish');
const Menu        = module.require('../../models/menu');

router.all('/*', middleware.proceedIfAuthenticated);

router.get('/', (req, res) => {
    User.getUserWithoutPassword(req.user._id, (userErr, user) => {
        if (userErr) throw userErr;

        Intolerance.getManyBut(req.user.intolerances, (err, notIntolerances) => {
            if (err) throw err;
            Ticket.getByUserID(req.user._id, (err2, tickets) => {
                if (err2) throw err2;

                res.render('pages/profile', {
                    title: 'Meu Perfil',
                    notIntolerances: notIntolerances,
                    user: user,
                    tickets: tickets
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

    const newTicket = new Ticket({
        user_info: {
            name: req.user.name,
            id: req.user._id,
            registration: req.user.registration
        },
        value: parseFloat(req.body.amount)
    });

    Ticket.createTicket(newTicket, (ticketErr) => {
        if (ticketErr) throw ticketErr;

        User.updateWallet(req.user._id, req.body.amount * (-1), (userErr, affected, response) => {
            if (userErr) throw userErr;
            req.flash('alerts', [{
                param: 'user-wallet',
                msg: `R$ ${req.body.amount} Retirados da sua carteira`,
                type: 'success'
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
            msg: `R$ ${req.body.amount} Adicionados à sua carteira`,
            type: 'success'
        }]);

        res.redirect('/user');
    });
});

router.get('/rating/:id/:week/:day/:period', (req, res) => {
    Menu.getMenuByWeek(req.params.week, (err, menu) => {
        if (err) throw err;

        let dayOfTheWeek = menu.days[req.params.day];

        if (req.params.period == 'lunch') {

            res.render('pages/rating/index', {
                title: 'Avaliar Refeição',
                ticketId: req.params.id,
                menu: dayOfTheWeek.lunch
            });
        } else if (req.params.period == 'dinner') {

            res.render('pages/rating/index', {
                title: 'Avaliar Refeição',
                ticketId: req.params.id,
                menu: dayOfTheWeek.dinner
            });
        } else {
            req.flash('alerts', [{
                param: 'day-period',
                msg: `Período do dia inválido`,
                type: 'danger'
            }]);

            res.redirect(`/user/rating/${req.params.id}/${req.params.week}/${req.params.period}`);
        }
    });
});

router.post('/rating', (req, res) => {
    //req.body.id = ID do ticket
    Ticket.getById(req.body.id, (err, ticket) => {
        if (err) throw err;
        console.log('ticket found');

        if (ticket.validation.status === true) {
          //Ticket ja foi utilizado

            //req.body.dishRating[] = array contendo a nota de cada Prato
            //req.body.comment = string do comentario da avaliação


            if(ticket.rating.status === false) {
              //Ticket ainda nao foi avaliado

                Menu.findDishesByTime(ticket.validation.date, (dishesID) => {
                    console.log(dishesID);
                    let waiting = dishesID.length;
                    validateDishs(req, res, dishesID, waiting, () => {

                        Ticket.validateRating(ticket._id, req.body.comment, (err2, affected, response) => {
                            if (err2) throw err2;

                            console.log("success validating rating");
                            res.redirect('/user');
                        });
                    });
                });
            } else {
                  console.log("Ticket ja foi avaliado")
            }
        } else {
            console.log("Ticket ainda nao utilizado");
        }
    });
});

async function validateDishs(req, res, dishesID, waiting, callback) {

    dishesID.forEach((dishID, index, array) => {

        Dish.addRating(dishID, req.body.dishRating[index], (err, affected, response) => {
          //TODO: As notas do array req.body.dishRating [ nota1, nota2, nota3, nota4 ] tem que ser atribuidas
          //corretamente ao dishID correto. (os indices do array dishesID podem estar diferentes do body.dishRating)

            if (err) throw err;

            console.log(affected.name + ' was rated');
            Dish.addRatingCounter(dishID, (err2, affected, response) => {
                if (err2) throw err2;

                waiting--;
                if (waiting === 0) {
                    callback();
                }
            });
        });
    });
}

module.exports = router;
