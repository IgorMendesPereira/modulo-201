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

    patchByModuloIdAndUpdates: async function (modulo_id, updates) {
        const fullUpdate = {
            modulo_id,
            ...updates
        }
        if (platform.getOption() == platform.options.ec2) {
            platform.addMessage(fullUpdate)
        } else if (platform.getOption() == platform.options.bb) {
            try {
                const intencao = await db.intencoes.update(updates, { where: { modulo_id: modulo_id } })
                socket.emit('update_intencoes', fullUpdate)
                return intencao
            } catch (err) {
                console.log('[HELPERS/INTENCOES/PATCHBYMODULOIDANDUPDATES]: ' + `[${err.name}] ` + err.message)
                throw err
            }
        }
    },

    postByModuloId: async function (modulo_id) {
        try {
            if (modulo_id == (null || undefined)) throw new ValidationError(Object.keys({ modulo_id })[0]) // Object.keys pega o nome da variavel ao inves do valor

            const newIntencao = await db.intencoes.create({
                modulo_id,
                on_off: 0,
                front_back: 0,
                water: 0,
                percent: 0
            })

            return newIntencao
        } catch (err) {
            console.log('[HELPERS/INTENCOES/POSTBYMODULOID]: ' + `[${err.name}] ` + err.message)
            throw err
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

    deleteByModuloId: async function (modulo_id) {
        try {
            const deletedIntencao = await db.intencoes.destroy({
                where: { modulo_id: modulo_id }
            })

            return deletedIntencao
        } catch (err) {
            console.log('[HELPERS/INTENCOES/DELETEBYMODULOID]: ' + err.message)
            throw err
        }
    }
}