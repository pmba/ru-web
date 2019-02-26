const express       = module.require('express');
const router        = express.Router();
const path          = module.require('path');

const checkPerson   = module.require('../checkPersonController');

var viewsPath       = { root : path.join(__dirname, '../../views') };

var checkUserData = (req, res, next) => {
    if (req.body.username == '' || req.body.password == '') res.send('Fail to Register.');
    next();
};

router.get('/checar', (req, res) => {
    res.sendFile('/web/ufalCheck.html', viewsPath);
});

router.post('/checar', checkUserData, (req, res) => {
    (async () => {
        try {
            var url = await checkPerson(req.body.username, req.body.password);
            res.send(url);
        } catch (e) {
            console.error(e);
        }
    })();
});

module.exports      = router;