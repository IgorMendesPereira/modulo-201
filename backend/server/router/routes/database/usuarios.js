require("dotenv").config(); //Arquivo que configura o .env do token

const bcrypt = require('bcryptjs') //Lib de criptografia
const jwt = require('jsonwebtoken') //Gerador de token via JSON

module.exports = (app, db) => {

  // GET all users
  app.get('/usuarios', (req, res) => {
    db.usuarios.findAll()
      .then(usuarios => {
        res.json(usuarios);
      });
  });

  //Get single user by id
  app.get('/usuarios/:usuario_id', (req, res) => {
    const usuario_id = req.params.usuario_id;
    db.usuarios.findAll({
      where: { usuario_id: usuario_id }
    })
      .then(usuario => {
        res.json(usuario);
      });
  });

  // POST single user e criptografa a senha
  app.post('/usuarios', (req, res) => {
    const login = req.body.login.toLowerCase();
    const tipouser = req.body.tipouser;
    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
      if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
      db.usuarios.create({
        login: login,
        senha: hash,
        tipouser: tipouser
      })
    })

      .then(newUsuario => {
        res.json(newUsuario);
      })
  });

  // PATCH single user
  app.patch('/usuarios/:usuario_id', (req, res) => {
    const usuario_id = req.params.usuario_id;
    const updates = {
      login: req.body.login,
      senha: req.body.senha,
      tipouser: req.body.tipouser
    }

    db.usuarios.update(updates, { where: { usuario_id: usuario_id } })
      .then(updatedUsuario => {
        res.json(updatedUsuario);
      });
  });

  // DELETE single user
  app.delete('/usuarios/:usuario_id', (req, res) => {
    const usuario_id = req.params.usuario_id;
    db.usuarios.destroy({
      where: { usuario_id: usuario_id }
    })
      .then(deletedUsuario => {
        res.json(deletedUsuario);
      });
  });

  //Pega o usuario ID, compara login e senha digitado com o login e senha criptografado
  //e gera o token para o client flutar nas paginas de forma segura...

  app.post('/usuarios/:login', (req, res) => {
    const login = req.params.login.toLowerCase()
    const senha = req.body.senha
    //console.log("oi", login)
    db.usuarios.findAll({
      where: { login: login }
    })
      .then(usuarios => {
        usuarios.forEach(usuario => {
          console.log('Comparação com login', login)
          console.log('Senha enviada', senha, 'e senha criptografada', usuario.dataValues.senha)
          bcrypt.compare(senha, usuario.dataValues.senha, (err, results) => {
            if (err) {
              return res.status(401).send({ mensagem: "Falha na Autenticação" })
            }
            if (results) {
              const token = jwt.sign({
                usuario_id: usuario.usuario_id,
                login,
                senha
              },
                process.env.JWT_KEY,
                {
                  expiresIn: "100000d"
                })
              return res.status(200).send({
                mensagem: 'Autenticado',
                token: token
              })
            }
            return res.json({ mensagem: "Falha na Autenticação" })
          })
        })
        if (usuarios.length <= 0) {
          return res.json({ mensagem: "Falha na Autenticação" });
        }
      })
  })
};