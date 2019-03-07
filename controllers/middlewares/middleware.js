module.exports = {
    validation: (req, res, next) => {
        req.checkBody('username', 'Login não pode ser vazio').notEmpty();
        req.checkBody('password', 'Senha não pode ser vazia').notEmpty();
        req.checkBody('passwordConfirmation', 'As senhas digitadas não correspondem').equals(req.body.password);

        next();
    },

    cpfCheck: (strCPF) => {
      if(strCPF.length != 11) return false;

      let Soma;
      let Resto;
      Soma = 0;

      if (strCPF == "00000000000") return false;

      for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

      Soma = 0;
      for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11)) Resto = 0;
      if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
      return true;
    }
}
