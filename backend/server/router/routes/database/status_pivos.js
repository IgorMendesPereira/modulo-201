const helper = require('../../../helpers/status_pivos')
const platform = require('../../../config/platform')

module.exports = (app, db) => {

  function patch(req) {
    const modulo_id = req.params.modulo_id; //faz-se o uso de req.params pois na rota (/status_pivos/:status_pivo_id) o status_pivo_id se torna disponivel para ser acessado com req.params
    const updates = {}
    const date = new Date()
    const time_stamp = date.getDate()

    if (req.body.on_off != null) updates.on_off = req.body.on_off
    if (req.body.front_back != null) updates.front_back = req.body.front_back
    if (req.body.water != null) updates.water = req.body.water
    if (req.body.percent != null) updates.percent = req.body.percent
    if (req.body.volt != null) updates.volt = req.body.volt
    if (req.body.pressure != null) updates.pressure = req.body.pressure
    if (req.body.fail != null) updates.fail = req.body.fail
    if (req.body.time_stamp != null) updates.time_stamp = time_stamp

    helper.patch(modulo_id, updates)
  }
  // GET all status
  app.get('/status_pivos', async (req, res) => {
    try {
      const status_pivos = await db.status_pivos.findAll();

      res.json(status_pivos)
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  // GET one status by id
  app.get('/status_pivos/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;

    try {
      const status_pivos = await helper.getById(modulo_id);

      res.json(status_pivos);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  //Quando der um post em status pivô, automaticamente irá dar um post no historico também com aquelas informações
  app.post('/status_pivos', (req, res) => {
    const on_off = req.body.on_off;
    const front_back = req.body.front_back;
    const water = req.body.water;
    const percent = req.body.percent;
    const volt = req.body.volt;
    const pressure = req.body.pressure;
    const fail = req.body.fail;
    const modulo_id = req.body.modulo_id;

    db.pivos.findAll({
      where: { modulo_id: modulo_id }
    })

      .then(pivo => {
        const fk_pivo_encontrado = pivo[0].dataValues.modulo_id

        db.status_pivos.create({
          on_off: on_off,
          front_back: front_back,
          water: water,
          percent: percent,
          volt: volt,
          pressure: pressure,
          fail: fail,
          modulo_id: fk_pivo_encontrado
        })

        db.historicos.create({
          on_off: on_off,
          front_back: front_back,
          water: water,
          percent: percent,
          volt: volt,
          pressure: pressure,
          fail: fail,
          modulo_id: fk_pivo_encontrado
        })
          .then(newHistoricoeStatus => {
            res.json(newHistoricoeStatus);
          });
      });
  });

  // PATCH single status
  app.patch('/status_pivos/:modulo_id', (req, res) => patch(req));

  app.delete('/status_pivos/:modulo_id', (req, res) => {
    const modulo_id = req.params.modulo_id;
    db.status_pivos.destroy({
      where: { modulo_id: modulo_id }
    })
      .then(deletedStatusPivo => {
        res.json(deletedStatusPivo);
      });
  });

  function createHistorico(updatedStatus) {
    db.historicos.create({
      on_off: updatedStatus.on_off,
      front_back: updatedStatus.front_back,
      water: updatedStatus.water,
      percent: updatedStatus.percent,
      volt: updatedStatus.volt,
      pressure: updatedStatus.pressure,
      fail: updatedStatus.fail,
      modulo_id: updatedStatus.modulo_id //TODO FAZER CONCENTRADOR ID NOT NULL
    })
  }
};