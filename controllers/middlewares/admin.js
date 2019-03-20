module.exports.proceedIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === -1 || req.user.role === -2)) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

module.exports.proceedIfNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/inicio');
    }
}