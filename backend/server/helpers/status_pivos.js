const db = require('../config/db')
const historicos_helper = require('./historicos')
const platform = require('../config/platform')
const socket = require('../socket')


async function getById(modulo_id) {
    const status = await db.status_pivos.findAll({
        where: { modulo_id: modulo_id }
    })

    return status;
}

function update(modulo_id, updates) {
    const fullUpdate = {
        modulo_id,
        ...updates
    }

    getById(modulo_id).then(status => {
        if (status !== updates) {
            db.status_pivos.update(updates, { returning: true, plain: true, where: { modulo_id: modulo_id } })
                .then(rowsAffected => {
                    //console.log('Status patched pelo helper, status: ' + rowsAffected)
                    socket.emit('update_status', fullUpdate)
                    db.status_pivos.findAll({
                        where: { modulo_id: modulo_id }
                    })
                        .then(updatedStatusPivo => {
                            historicos_helper.post(updatedStatusPivo[0].dataValues)
                        });

                    return rowsAffected
                });
        }
    })
}

module.exports = {
    // Updates é um objeto contendo 3 propriedades:
    // on_off
    // front_back
    // water
    // Quando chamar essa função, crie um objeto com essas 3 propriedades e coloque
    // valores corretos de acordo com a tabela de on_off/front_back/water
    patch: function (modulo_id, updates) {
        if (platform.getOption() === platform.options.ec2) {
            update(modulo_id, updates)
        } else if (platform.getOption() === platform.options.bb) {
            update(modulo_id, updates)

            const fullUpdate = {
                modulo_id,
                ...updates
            }
            platform.addMessage(fullUpdate)
        }
    },

    getAll: function () {
        var promise = new Promise((resolve, reject) => {
            db.status_pivos.findAll()
                .then(status_pivos => {
                    resolve(status_pivos)
                });
        })

        return promise
    },

    getById: function (modulo_id) {
        return getById(modulo_id)
    }
}