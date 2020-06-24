const helper = require('../../../helpers/pivos')


module.exports = (app, db) => {
  // GET all farms
  app.get('/pivos', async (req, res) => {
    try {
      const pivos = await helper.getAll()

      res.json(pivos)
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  //Pega todos os pivos de tal fazenda
  app.get('/pivos/:fazenda_id', async (req, res) => {
    const fazenda_id = req.params.fazenda_id;

    try {
      const pivos = await helper.getByFazendaId(fazenda_id)

      res.json(pivos)
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  // POST single farm
  // TODO BANANA VEIA
  app.post('/pivos', async (req, res) => {

    const { modulo_id, fazenda_id, map_x, map_y, radius, start_angle, end_angle,
      counter_clockwise, latitude_pivo, longitude_pivo, pivo_name } = req.body

    const body = {
      modulo_id, fazenda_id, map_x, map_y, radius, start_angle, end_angle,
      counter_clockwise, latitude_pivo, longitude_pivo, pivo_name
    }
    try {
      const newPivo = await helper.post(body)

      res.json(newPivo)
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  // PATCH single farm
  app.patch('/pivos/:pivo_id', (req, res) => {
    const pivo_id = req.params.pivo_id;
    const updates = {
      //pivo_id = req.body.pivo_id,
      modulo_id: req.body.modulo_id,
      pivo_name: req.body.pivo_name
    }

    db.pivos.update(updates, { where: { modulo_id: pivo_id } })
      .then(updatedPivo => {
        res.json(updatedPivo);
      });
  });

  app.delete('/pivos/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;

    try {
      const deleted = await helper.deleteByModuloId(modulo_id)

      res.json(deleted);

    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  function createStatus(modulo_id) {
    const date = new Date()
    const time_stamp = date.getDate()

    return db.status_pivos.create({
      on_off: 0,
      front_back: 0,
      water: 0,
      percent: 00,
      volt: 0,
      pressure: 0,
      fail: 0,
      modulo_id: modulo_id,
      time_stamp,
    })
  }

  function createIntencao(newStatus) {
    const date = new Date()
    const time_stamp = date.getDate()

    var newIntention = {
      on_off: newStatus.on_off,
      front_back: newStatus.front_back,
      water: newStatus.water,
      modulo_id: newStatus.modulo_id,
      time_stamp,
    }

    db.intencoes.create(newIntention)
  }

  function createHistorico(newStatus) {
    db.historicos.create(newStatus.dataValues)
  }
}