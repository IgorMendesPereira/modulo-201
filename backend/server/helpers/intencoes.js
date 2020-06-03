const db = require('../config/db')
const platform = require('../config/platform')
const socket = require('../socket')

module.exports = {

    // Updates é um objeto contendo 3 propriedades:
    // on_off
    // front_back
    // water
    // Quando chamar essa função, crie um objeto com essas 3 propriedades e coloque
    // valores corretos de acordo com a tabela de on_off/front_back/water

    patch: function (modulo_id, updates) {
        const fullUpdate = {
            modulo_id,
            ...updates
        }
        if (platform.getOption() == platform.options.ec2) {
            //console.log('UHULLL', fullUpdate)
            platform.addMessage(fullUpdate)
        } else if (platform.getOption() == platform.options.bb) {

            db.intencoes.update(updates, { returning: true, plain: true, where: { modulo_id: modulo_id } })
                .then(updated => {
                    socket.emit('update_intencoes', fullUpdate)
                    //console.log('OIE', fullUpdate)
                    return updated
                })
        }
    },

    getAll: function () {
        var promise = new Promise((resolve, reject) => {
            db.intencoes.findAll()
                .then(intencoes => {
                    resolve(intencoes)
                });
        })
        return promise
    },

    getById: function (modulo_id) {
        var promise = new Promise((resolve, reject) => {
            db.intencoes.findAll({
                where: { modulo_id: modulo_id }
            })
                .then(intencoes => {
                    resolve(intencoes)
                });
        })
        return promise
    },
}