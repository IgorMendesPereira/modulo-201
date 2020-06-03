const db = require('../config/db')

module.exports = {

    // Updates é um objeto contendo 3 propriedades:
    // on_off
    // front_back
    // water
    // Quando chamar essa função, crie um objeto com essas 3 propriedades e coloque
    // valores corretos de acordo com a tabela de on_off/front_back/water
    post: function (updatedStatus) {
        db.historicos.create({
            on_off: updatedStatus.on_off,
            front_back: updatedStatus.front_back,
            water: updatedStatus.water,
            percent: updatedStatus.percent,
            volt: updatedStatus.volt,
            pressure: updatedStatus.pressure,
            fail: updatedStatus.fail,
            modulo_id: updatedStatus.modulo_id,
            time_stamp: updatedStatus.time_stamp,
        })
            .then(result => {
                //console.log('Historico posted pelo helper, resultado: ' + result)
            })
    }
}