const express = module.require('express');
const router = express.Router();

const middleware = module.require('../middlewares/middleware');

router.all('/*', middleware.proceedIfAuthenticated);

router.get('/', (req, res) => {
    res.send('good to go');
});


module.exports = router;