const db = require('../config/db')
const historicos_helper = require('./historicos')

const helpers = {
    historicos: require('./historicos')
}
const platform = require('../config/platform')
const socket = require('../socket')

async function getById(modulo_id) {
    const status = await db.status_pivos.findAll({
        where: { modulo_id: modulo_id }
    })

    return status;
}

function update(modulo_id, updates) {
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

function isEqual(currentStatus, newStatus) {

    /* console.log('STATUS:  CURRENT | new')
    console.log(`front_back: ${currentStatus.front_back} - ${newStatus.front_back}`)
    console.log(`water: ${currentStatus.water} - ${newStatus.water}`)
    console.log(`on_off: ${currentStatus.on_off} - ${newStatus.on_off}`)
    console.log(`percent: ${currentStatus.percent} - ${newStatus.percent}`)
    console.log(`fail: ${currentStatus.fail} - ${newStatus.fail}`)
    console.log(`pressure: ${currentStatus.pressure} - ${newStatus.pressure}`)
    console.log(`volt: ${currentStatus.volt} - ${newStatus.volt}`) */

    return ((currentStatus.on_off == newStatus.on_off) &&
        (currentStatus.water == newStatus.water) &&
        (currentStatus.front_back == newStatus.front_back) &&
        (currentStatus.fail == newStatus.fail) &&
        (currentStatus.percent == newStatus.percent) &&
        (currentStatus.volt == newStatus.volt) &&
        (currentStatus.pressure == newStatus.pressure))
}

module.exports = {
    // Updates é um objeto contendo 3 propriedades:
    // on_off
    // front_back
    // water
    // Quando chamar essa função, crie um objeto com essas 3 propriedades e coloque
    // valores corretos de acordo com a tabela de on_off/front_back/water

    patch: async function (modulo_id, updates) {
        const fullUpdate = {
            modulo_id,
            ...updates
        }

        try {
            const status = await module.exports.getByModuloId(modulo_id)
            if (!isEqual(status[0], updates)) {
                console.log(updates.percent)
                const newStatus = await db.status_pivos.update(updates, { where: { modulo_id: modulo_id } })
                const newHistorico = await helpers.historicos.postByModuloIdAndUpdates(modulo_id, updates)

                if (platform.getOption() === platform.options.bb) {
                    platform.addMessage(fullUpdate)
                }

                socket.emit('update_status', fullUpdate)

                return { status: newStatus, historicos: newHistorico }
            }

        } catch (err) {
            console.log('[HELPERS/STATUS_PIVOS/PATCHBYMODULOID]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    postByModuloId: async function (modulo_id) {
        try {
            if (modulo_id == (null || undefined)) throw new ValidationError(Object.keys({ modulo_id })[0]) // Object.keys pega o nome da variavel ao inves do valor

            const newStatus = await db.status_pivos.create({
                modulo_id,
                on_off: 0,
                front_back: 0,
                water: 0,
                percent: 0,
                volt: 0,
                pressure: 0,
                fail: 0
            })

            return newStatus
        } catch (err) {
            console.log('[HELPERS/STATUS_PIVOS/POSTBYMODULOID]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    getAll: async function () {
        try {
            const status_pivos = db.status_pivos.findAll()

            return status_pivos;
        } catch (err) {
            console.log('[HELPERS/STATUS_PIVOS/GETALL]: ' + err.message)
            throw err
        }
    },

    getByModuloId: async function (modulo_id) {
        try {
            const status_pivos = db.status_pivos.findAll({ where: { modulo_id: modulo_id } })

            return status_pivos;
        } catch (err) {
            console.log('[HELPERS/STATUS_PIVOS/GETBYMODULOID]: ' + err.message)
            throw err
        }
    },

    deleteByModuloId: async function (modulo_id) {
        try {
            const deletedStatus = await db.status_pivos.destroy({
                where: { modulo_id: modulo_id }
            })

            return deletedStatus
        } catch (err) {
            console.log('[HELPERS/PIVOS/DELETEBYMODULOID]: ' + err.message)
            throw err
        }
    }
}