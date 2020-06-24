const db = require('../config/db')
const platform = require('../config/platform')
const socket = require('../socket')

module.exports = {
    getAll: async function () {
        try {
            const agendamentos = await db.agendamentoss.findAll()
            return agendamentos
        } catch (err) {
            console.log('[HERLPER/AGENDAMENTOS/GETALL]: ' + err.message)
            throw err
        }
    },

    getByModuloId: async function (modulo_id) {
        try {
            const agendamentos = await db.agendamentos.findAll({
                where: { modulo_id: modulo_id }
            })

            return agendamentos
        } catch (err) {
            console.log('[HELPERS/AGENDAMENTOS/GETBYMODULOID]: ' + err.message)
            throw err
        }
    }

    //TODO TERMINAR ROTAS DE AGENDAMENTO
}