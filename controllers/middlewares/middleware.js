module.exports = { 
    checkUserData: (req, res, next) => {
        if (req.body.username == '' || req.body.password == '') res.send('Fail to Register.');
        next();
    }
}