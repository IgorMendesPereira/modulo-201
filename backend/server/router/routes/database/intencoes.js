const helper = require('../../../helpers/intencoes');
const platform = require('../../../config/platform');

module.exports = (app, db) => {
  // GET all intencoes
  app.get('/intencoes', (req, res) => {
    helper.getAll().then(allIntencoes => {
      res.json(allIntencoes);
    });
  });

  // GET one intencao by id
  app.get('/intencoes/:modulo_id', (req, res) => {
    const modulo_id = req.params.modulo_id;
    helper.get(modulo_id).then(intencao => {
      res.json(intencao);
    });
  });

  app.post('/intencoes/:modulo_id', (req, res) => {
    const codigo = req.body.codigo;
    const modulo_id = req.params.modulo_id;
    const on_off = req.body.codigo[2];
    const front_back = req.body.codigo[0];
    const water = req.body.codigo[1];
    const percent = req.body.codigo[3];

    /*  console.log('alou alouu')
     console.log(codigo[3]) */

    db.intencoes.create({
      on_off,
      front_back,
      water,
      percent,
      modulo_id
    });
  });

  // PATCH single intencao
  app.patch('/intencoes/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;
    const on_off = req.body.on_off;
    const front_back = req.body.front_back;
    const water = req.body.water;
    const percent = req.body.percent;

    const updates = {
      on_off,
      front_back,
      water,
      percent
    };

    console.log(updates)

    try {
      const intencao = await helper.patchByModuloIdAndUpdates(modulo_id, updates);
      res.json(intencao);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  app.delete('/intencoes/:modulo_id', (req, res) => {
    const modulo_id = req.params.modulo_id;
    db.intencoes
      .destroy({
        where: { modulo_id: modulo_id }
      })
      .then(deletedIntencao => {
        res.json(deletedIntencao);
      });
  });
};
