const routes = [
  require('./routes/database/usuarios'),
  require('./routes/database/fazendas'),
  require('./routes/database/pivos'),
  require('./routes/database/status_pivos'),
  require('./routes/database/historicos'),
  require('./routes/database/agendamentos'),
  require('./routes/database/intencoes'),
];

/* Quando se importa esse arquivo, é passado a referencia ao express(app)
e a referencia a configuracao do nosso banco de dados(db) com os modelos e etc.
Essas referencias entao sao passadas para cada arquivo de rota (usuario,fazenda,etc)
para que la dentro se possa fazer o uso das funcoes app.get, app.post, etc. 
  Tambem adiciona a rota da build, todas as 
*/


module.exports = {
  addRoutes: function (path, app, db) {
    routes.forEach((route) => {
      route(app, db);
    });
    app.get('/*', (req, res) => {
      res.sendFile(path);
    });
  }
} 