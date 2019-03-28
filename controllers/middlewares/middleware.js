module.exports = {
  validation: (req, res, next) => {
    req.checkBody('username').custom(value => cpfCheck(value)).withMessage('CPF Digitado é inválido');
    req.checkBody('password', 'Senha não pode ser vazia').notEmpty();
    // req.checkBody('passwordConfirmation', 'As senhas digitadas não correspondem').equals(req.body.password);

    next();
  },

  proceedIfAuthenticated: (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 0) {
      next();
    } else {
      res.redirect('/inicio');
    }
  },

  proceedIfNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/inicio');
    }
  },

  validateWalletCash: (req, res, next) => {
    if (req.body.amount >= 3) {
      next();
    } else {
      req.flash('alerts', [{
        param: 'user-wallet',
        msg  : `Recargas só podem ser feitas apartir de R$ 3,00`,
        type : 'warning'
      }]);
      res.redirect('/user');
    }
  },

  validatePurchase: (req, res, next) => {
    if(req.body.amount <= 0) {
      req.flash('alerts', [{
        param: 'user-wallet',
        msg  : `Operação inválida`,
        type : 'warning'
      }]);
      res.redirect('/user');
    } else if (req.user.wallet >= req.body.amount) {
      next();
    } else {
      req.flash('alerts', [{
        param: 'user-wallet',
        msg  : `Fundos insuficientes`,
        type : 'warning'
      }]);
      res.redirect('/user');
    }
  }
}

function cpfCheck(strCPF) {
  if (strCPF.length != 11) return false;

  let Soma;
  let Resto;
  Soma = 0;

  if (strCPF == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
      Resto                     = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

      Soma                       = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
      Resto                      = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}
