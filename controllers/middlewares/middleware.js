module.exports = { 
    validation: (req, res, next) => {
        req.checkBody('username', 'Login não pode ser vazio').notEmpty();
        req.checkBody('password', 'Senha não pode ser vazia').notEmpty();
        req.checkBody('passwordConfirmation', 'As senhas digitadas não correspondem').equals(req.body.password);

        next();
    }
}