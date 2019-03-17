const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

const Intolerance = module.require('../../models/intolerance');
// const Admin = module.require('../../models/admin');
const Ticket = module.require('../../models/ticket');

// router.all('/*', middleware.proceedIfAuthenticated);

router.get('/validation', (req, res) => {
    res.render('pages/validation',
    {
        title: 'Validação'
    });
});

router.post('/validation', (req, res) => {
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