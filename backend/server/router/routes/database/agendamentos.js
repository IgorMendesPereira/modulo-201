const helper = require('../../../helpers/agendamentos')

module.exports = (app, db) => {

  const net = require('net')
  // GET all agendamentos
  app.get('/agendamentos', async (req, res) => {
    try {
      const agendamentos = await helper.getAll(res)
      res.json(agendamentos);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  // GET one agendamento by id
  app.get('/agendamentos/:modulo_id', async (req, res) => {
    const modulo_id = req.params.modulo_id;

    try {
      const agendamentos = await helper.getByModuloId(modulo_id)
      res.json(agendamentos);
    } catch (err) {
      res.status(500).send(err.message)
    }
  });

  //Quando der um post em agendamento, automaticamente irá dar um post no historico também com aquelas informações
  app.post('/agendamentos', async (req, res) => {
    const { on_off, front_back, water, percent, date_on, date_off, modulo_id } = req.body

    db.pivos.findAll({
      where: { modulo_id: modulo_id }
    })

      .then(agendamento => {
        db.agendamentos.create({
          on_off,
          front_back,
          water,
          percent,
          date_on,
          date_off,
          modulo_id
        })

        res.json(agendamento)
      });
  });

  // PATCH single agendamento
  app.patch('/agendamentos/:agendamento_pivo_id', (req, res) => {
    const agendamento_pivo_id = req.params.agendamento_pivo_id; //faz-se o uso de req.params pois na rota (/sagendamentos/:agendamento_agendamento_id) o agendamento_agendamento_id se torna disponivel para ser acessado com req.params
    const updates = {}

    if (req.body.on_off != null) updates.on_off = req.body.on_off
    if (req.body.front_back != null) updates.front_back = req.body.front_back
    if (req.body.water != null) updates.water = req.body.water
    if (req.body.percent != null) updates.percent = req.body.percent


    db.agendamentos.update(updates, { returning: true, plain: true, where: { agendamento_pivo_id: agendamento_pivo_id } })
      .then(rowsAffected => {
        db.agendamentos.findAll({
          where: { agendamento_pivo_id: agendamento_pivo_id }
        })

        res.json(rowsAffected);
      });
  });

  app.delete('/agendamentos/:modulo_id', (req, res) => {
    const modulo_id = req.params.modulo_id;
    db.agendamentos.destroy({
      where: { modulo_id: modulo_id }
    })
      .then(deletedAgendamento => {
        res.json(deletedAgendamento);
      });
  });

};