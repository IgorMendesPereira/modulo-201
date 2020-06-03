module.exports = (app, db) => {
  // GET all historicos
  app.get('/historicos', async (req, res) => {
    try {
      const historicos = await db.historicos.findAll()

      res.json(historicos);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  // GET one historico by modulo_id
  app.get('/historicos/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;


    try {
      const historicos = await db.historicos.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        where: { modulo_id: modulo_id }
      })

      res.json(historicos);

    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });
  // PATCH single farm
  app.patch('/historico/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id; //faz-se o uso de req.params pois na rota (/status_pivos/:status_pivo_id) o status_pivo_id se torna disponivel para ser acessado com req.params
    const { on_off, front_back, water, percent, volt, pressure, fail } = req.body
    const updates = {
      on_off,
      front_back,
      water,
      percent,
      volt,
      pressure,
      fail
    }

    try {
      const updatedHistorico = await db.historicos.update(updates, { where: { modulo_id: modulo_id } })

      res.json(updatedHistorico);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  app.delete('/historicos/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;

    try {
      const deletedHistorico = await db.historicos.destroy({
        where: { modulo_id: modulo_id }
      })

      res.json(deletedHistorico);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });
};  