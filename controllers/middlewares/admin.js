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

module.exports.validateIntoleranceCreation = (req, res, next) => {
    req.checkBody('food', 'Alimento não pode ser vazio').notEmpty();

    next();
}

module.exports.validateAdminCreation = (req, res, next) => {
    req.checkBody('name', 'Nome não pode ser vazio').notEmpty();
    req.checkBody('username', 'Usuário não pode ser vazio').notEmpty();
    req.checkBody('role', 'Usuário não pode ser vazio').notEmpty();
    req.checkBody('password', 'Senha não pode ser vazia').notEmpty();
    req.checkBody('passwordConfirmation', 'As senhas digitadas não correspondem').equals(req.body.password);

    next();
}

module.exports.validateAdminEdition = (req, res, next) => {
    
    if (req.body.passwordWillChange) {
        req.checkBody('password', 'Senha não pode ser vazia').notEmpty();
        req.checkBody('passwordConfirmation', 'As senhas digitadas não correspondem').equals(req.body.password);
    }

    req.checkBody('name', 'Nome não pode ser vazio').notEmpty();
    req.checkBody('username', 'Usuário não pode ser vazio').notEmpty();
    req.checkBody('role', 'Usuário não pode ser vazio').notEmpty();

    next();
}

module.exports.validateDishCreation = (req, res, next) => {
    req.checkBody('name', 'Nome não pode ser vazio').notEmpty();
    req.checkBody('type', 'Tipo do prato não pode ser vazio').notEmpty();

    next();
}