const helper = require('../../../helpers/fazendas')

module.exports = (app, db) => {

  app.get('/fazendas', async (req, res) => {
    try {
      const fazendas = await helper.getAll()

      res.json(fazendas);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  app.get('/fazendas/:usuario_id', async (req, res) => {
    const usuario_id = req.params.usuario_id;

    try {
      const fazendas = await helper.getByUsuarioId(usuario_id)

      res.json(fazendas);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  app.post('/fazendas', async (req, res) => {
    const { usuario_id, telefone, propriedade, cidade, latitude_fazenda, longitude_fazenda, concentrador_ip } = req.body;
    const body = { usuario_id, telefone, propriedade, cidade, latitude_fazenda, longitude_fazenda, concentrador_ip }

    try {
      const fazenda = await helper.post(body)

      res.json(fazenda);
    } catch (err) {
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
      const deletedFazenda = await helper.deleteByFazendaId(fazenda_id)

      res.json(deletedFazenda);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });
};