module.exports = (app, db) => {
  // GET all farms
  app.get('/pivos', (req, res) => {
    db.pivos.findAll()
      .then(pivos => {
        res.json(pivos);
      });
  });

  //Pega todos os pivos de tal fazenda
  app.get('/pivos/:fazenda_id', (req, res) => {
    const fazenda_id = req.params.fazenda_id;
    db.pivos.findAll({
      where: { fazenda_id: fazenda_id }
    })
      .then(fazendas => {
        res.json(fazendas);
      });
  });

  /*  // GET one farm by id
   app.get('/pivos/:pivo_id', (req, res) => {
     const pivo_id = req.params.pivo_id;
     db.pivos.findAll({
       where: { pivo_id: pivo_id }
     })
       .then(pivos => {
         res.json(pivos);
       });
   }); */

  // POST single farm
  // TODO BANANA VEIA
  app.post('/pivos', (req, res) => {
    const modulo_id = req.body.modulo_id;
    const fazenda_id = req.body.fazenda_id;
    const map_x = req.body.map_x
    const map_y = req.body.map_y
    const radius = req.body.radius
    const start_angle = req.body.start_angle
    const end_angle = req.body.end_angle
    const counter_clockwise = req.body.counter_clockwise
    const latitude_pivo = req.body.latitude_pivo
    const longitude_pivo = req.body.longitude_pivo
    const pivo_name = req.body.pivo_name

    const date = new Date()
    const time_stamp = date.getDate()

    db.fazendas.findAll({
      where: { fazenda_id: fazenda_id }
    })
      .then(fazenda => {
        const fk_fazenda_encontrado = fazenda[0].dataValues.fazenda_id //estamos recebendo o valor do ID do ususario e armazedando na FK

        db.pivos.create({
          modulo_id: modulo_id,
          map_x: map_x,
          map_y: map_y,
          radius: radius,
          start_angle: start_angle,
          end_angle: end_angle,
          counter_clockwise: counter_clockwise,
          latitude_pivo: latitude_pivo,
          longitude_pivo: longitude_pivo,
          pivo_name: pivo_name,
          fazenda_id: fk_fazenda_encontrado,
          time_stamp,
        })
          .then(newPivo => {
            createStatus(modulo_id)
              .then(newStatusPivo => {
                createIntencao(newStatusPivo)
                createHistorico(newStatusPivo)
                res.json(newPivo)
              })
          });
      });
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

  app.delete('/pivos/:modulo_id', (req, res) => {
    const modulo_id = req.params.modulo_id;
    db.pivos.destroy({
      where: { modulo_id: modulo_id }
    })
      .then(deletedPivo => {
        res.json(deletedPivo);
      })
      .then(db.status_pivos.destroy({
        where: { modulo_id: modulo_id }
      }))
      .then(deletedStatus => {
        res.json(deletedStatus)
      })
      .then(db.historicos.destroy({
        where: { modulo_id: modulo_id }
      }))
      .then(deletedHistoricos => {
        res.json(deletedHistoricos)
      })
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