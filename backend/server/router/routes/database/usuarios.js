require("dotenv").config(); //Arquivo que configura o .env do token

const bcrypt = require('bcryptjs') //Lib de criptografia
const jwt = require('jsonwebtoken') //Gerador de token via JSON

const helper = require('../../../helpers/usuarios.js')

const DuplicateError = require('../../../errors/DuplicateError')

module.exports = (app, db) => {

  // GET all users
  app.get('/usuarios', async (req, res) => {
    try {
      const usuarios = await helper.getAll()

      res.json(usuarios);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  //Get single user by id
  app.get('/usuarios/:usuario_id', async (req, res) => {
    const usuario_id = req.params.usuario_id;
    try {
      const usuario = await helper.getByUsuarioId(usuario_id)

      res.json(usuario)
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  // POST single user e criptografa a senha
  app.post('/usuarios', async (req, res) => {
    const login = req.body.login.toLowerCase();
    const tipo_user = req.body.tipo_user
    bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
      if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

      try {
        console.log(login)
        const usuario = await helper.post({ login, hash, tipo_user })

        res.json(usuario)
      } catch (err) {
        res.status(500).send(err.message)
      }
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
  app.delete('/usuarios/:usuario_id', async (req, res) => {
    const usuario_id = req.params.usuario_id;

    try {
      const deleted = await helper.deleteByUsuarioId(usuario_id)

      res.json(deleted)
    } catch (err) {
      res.status(500).send(err.message)
    }
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