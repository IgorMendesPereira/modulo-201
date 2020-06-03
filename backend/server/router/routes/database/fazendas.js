module.exports = (app, db) => {

  app.get('/fazendas', async (req, res) => {
    try {
      const fazendas = await db.fazendas.findAll()

      res.json(fazendas);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  app.get('/fazendas/:usuario_id', async (req, res) => {
    const usuario_id = req.params.usuario_id;

    try {
      const fazendas = await db.fazendas.findAll({
        where: { usuario_id: usuario_id }
      })

      res.json(fazendas);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  app.post('/fazendas', async (req, res) => {
    const { usuario_id, telefone, propriedade, cidade,latitude_fazenda,longitude_fazenda, concentrador_id } = req.body;

    try {
      const newFazenda = await db.fazendas.create({
        usuario_id, telefone, propriedade, cidade,latitude_fazenda,longitude_fazenda, concentrador_id
      })

      res.json(newFazenda);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  app.patch('/fazendas/:fazenda_id', async (req, res) => {
    const fazenda_id = req.params.fazenda_id;
    const { usuario_id, nome, telefone, propriedade, cidade, modulo_id } = req.body;

    const updates = {
      usuario_id,
      nome,
      telefone,
      propriedade,
      cidade,
      modulo_id,
    }

    try {
      const updatedFazenda = await db.fazendas.update(updates, { where: { fazenda_id: fazenda_id } })

      res.json(updatedFazenda);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });

  app.delete('/fazendas/:fazenda_id', async (req, res) => {
    const fazenda_id = req.params.fazenda_id;

    try {
      const deletedFazenda = await db.fazendas.destroy({
        where: { fazenda_id: fazenda_id }
      })

      res.json(deletedFazenda);
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  });
};