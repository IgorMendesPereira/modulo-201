const db = require('../config/db')

module.exports = {

    // Updates é um objeto contendo 3 propriedades:
    // on_off
    // front_back
    // water
    // Quando chamar essa função, crie um objeto com essas 3 propriedades e coloque
    // valores corretos de acordo com a tabela de on_off/front_back/water
    postByModuloIdAndUpdates: async function (modulo_id, updates) {
        try {
            if (modulo_id == (null || undefined)) throw new ValidationError(Object.keys({ modulo_id })[0]) // Object.keys pega o nome da variavel ao inves do valor
            //TODO COLOCAR AQUELE TESTE DE VALIDATION ERROR DOS UPDATES TMB

            const newHistorico = await db.historicos.create({
                modulo_id,
                ...updates
            })

            return newHistorico
        } catch (err) {
            console.log('[HELPERS/HISTORICOS/POSTBYMODULOIDANDUPDATES]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    getById: async function (modulo_id) {
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
    },

    deleteByModuloId: async function (modulo_id) {
        try {
            const deletedHistoricos = await db.historicos.destroy({
                where: { modulo_id: modulo_id }
            })

            return deletedHistoricos
        } catch (err) {
            console.log('[HELPERS/HISTORICOS/DELETEBYMODULOID]: ' + err.message)
            throw err
        }
    }
}
