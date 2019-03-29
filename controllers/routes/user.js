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

router.get('/rating/reset', (req, res) => {
    Dish.resetAllRatingNumbers(() => {
        res.send('Done');
    });
});

router.post('/rating/:id/:week/:day/:period', (req, res) => {
    //id do ticket está nos parâmetros já

    var dishType = req.body.dishType; // Tipo da refeição, carnívora ou vegetariana
    var dishesAndScores = [];
    
    if (dishType === 'meat' && (req.body.meatAte && req.body.meatAte != "")) {
        if (req.body.meatRating && req.body.meatRating != "") {
            dishesAndScores.push({
                '_id': req.body.meatAte,
                'score': req.body.meatRating
            });
        }
    } else if (dishType === 'vegie' && (req.body.vegieAte && req.body.vegieAte != "")) {
        if (req.body.vegieRating && req.body.vegieRating != "") {
            dishesAndScores.push({
                '_id': req.body.vegieAte,
                'score': req.body.vegieRating
            });
        }
    }

    if (req.body.dessertAte && req.body.dessertAte != "") {
        if (req.body.dessertRating && req.body.dessertRating != "") {
            dishesAndScores.push({
                '_id': req.body.dessertAte,
                'score': req.body.dessertRating
            });
        }
    }

    if (req.body.drinkDrank && req.body.drinkDrank != "") {
        if (req.body.drinkRating && req.body.drinkRating != "") {
            dishesAndScores.push({
                '_id': req.body.drinkDrank,
                'score': req.body.drinkRating
            });
        }
    }

    Object.keys(req.body.sideDishRating).forEach(key => {
        if (req.body.sideDishRating[key] != "") {
            dishesAndScores.push({
                '_id': key,
                'score': req.body.sideDishRating[key]
            });
        }
    });

    Ticket.getById(req.params.id, (ticketErr, ticket) => {
        if (ticketErr) throw err;

        if (ticket.validation.status === true && ticket.rating.status === false) {
            //pode validar

            dishesAndScores.forEach(dish => {
                Dish.updateRatingNumbers(dish._id, dish.score, (dishErr, result) => {
                    if (dishErr) console.log(`\t[ERR] UPDATING DISH SCORE : ${dish._id}`);
                    else console.log(`\t[RATING] DISH SCORE UPDATED : ${dish._id}`);
                });
            });

            Ticket.validateRating(req.params.id, '', (ticketErr, result) => {
                if (ticketErr) throw ticketErr;

                req.flash('alerts', [{
                    param: 'ticket-validation',
                    msg: `Obrigado pela sua avaliação. ♥`,
                    type: 'success'
                }]);
                
                res.redirect('/user');
            });
        } else {
            req.flash('alerts', [{
                param: 'ticket-validation',
                msg: `O Ticket não pode ser validado ainda`,
                type: 'danger'
            }]);

            res.redirect('/user');
        }
    })
});

// router.post('/rating', (req, res) => {
//     //req.body.id = ID do ticket
//     Ticket.getById(req.body.id, (err, ticket) => {
//         if (err) throw err;
//         console.log('ticket found');

//         if (ticket.validation.status === true) {
//           //Ticket ja foi utilizado

//             //req.body.dishRating[] = array contendo a nota de cada Prato
//             //req.body.comment = string do comentario da avaliação


//             if(ticket.rating.status === false) {
//               //Ticket ainda nao foi avaliado

//                 Menu.findDishesByTime(ticket.validation.date, (dishesID) => {
//                     console.log(dishesID);
//                     let waiting = dishesID.length;
//                     validateDishs(req, res, dishesID, waiting, () => {

//                         Ticket.validateRating(ticket._id, req.body.comment, (err2, affected, response) => {
//                             if (err2) throw err2;

//                             console.log("success validating rating");
//                             res.redirect('/user');
//                         });
//                     });
//                 });
//             } else {
//                   console.log("Ticket ja foi avaliado")
//             }
//         } else {
//             console.log("Ticket ainda nao utilizado");
//         }
//     });
// });

module.exports = router;
