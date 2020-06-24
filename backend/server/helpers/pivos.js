const db = require('../config/db')

const WrongForeignKeyError = require('../errors/WrongForeignKeyError')
const DuplicateError = require('../errors/DuplicateError')
const ValidationError = require('../errors/ValidationError')

const helpers = {
    status_pivos: require('./status_pivos'),
    historicos: require('./historicos'),
    intencoes: require('./intencoes'),
}

module.exports = {

    getAll: async function () {
        try {
            const pivos = db.pivos.findAll()

            return pivos;
        } catch (err) {
            console.log('[HELPERS/PIVOS/GETALL]: ' + err.message)
            throw err
        }
    },

    getByFazendaId: async function (fazenda_id) {
        try {
            const pivos = await db.pivos.findAll({
                where: { fazenda_id: fazenda_id }
            })

            return pivos
        } catch (err) {
            console.log('[HELPERS/PIVOS/GETBYFAZENDAID]: ' + err.message)
            throw err
        }
    },

    post: async function (body) {
        const { modulo_id, fazenda_id, map_x, map_y, radius, start_angle, end_angle,
            counter_clockwise, latitude_pivo, longitude_pivo, pivo_name } = body

        try {
            for (attribute in body) {
                if (body[attribute] == (null || undefined)) throw new ValidationError()
            }

            const fazenda = await db.fazendas.findAll({ where: { fazenda_id: fazenda_id } })
            if (fazenda == 0) throw new WrongForeignKeyError("Fazenda com esse ID não existe!")

            const checkPivoModuloID = await db.pivos.findAll({ where: { modulo_id: modulo_id } })
            if (checkPivoModuloID.length > 0) throw new DuplicateError("Ja existe um pivo com esse modulo_id!")

            const checkPivoName = await db.pivos.findAll({ where: { pivo_name: pivo_name } })
            if (checkPivoName.length > 0) throw new DuplicateError("Ja existe um pivo com esse nome!")

            const newPivo = await db.pivos.create({
                modulo_id, fazenda_id, map_x, map_y, radius, start_angle, end_angle,
                counter_clockwise, latitude_pivo, longitude_pivo, pivo_name
            })

            const newStatus = await helpers.status_pivos.postByModuloId(modulo_id)
            const newIntencao = await helpers.intencoes.postByModuloId(modulo_id)

            return { pivos: newPivo, status_pivos: newStatus, intencoes: newIntencao }
        } catch (err) {
            console.log('[HELPERS/PIVOS/POST]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    deleteByModuloId: async function (modulo_id) {
        try {
            const deletedPivo = await db.pivos.destroy({
                where: { modulo_id: modulo_id }
            })

            const deletedStatus = await helpers.status_pivos.deleteByModuloId(modulo_id)
            const deletedIntencao = await helpers.intencoes.deleteByModuloId(modulo_id)
            const deletedHistoricos = await helpers.historicos.deleteByModuloId(modulo_id)

            return {
                pivos: deletedPivo,
                status_pivos: deletedStatus,
                intencoes: deletedIntencao,
                historicos: deletedHistoricos
            }
        } catch (err) {
            console.log('[HELPERS/PIVOS/DELETEBYMODULOID]: ' + err.message)
            throw err
        }
    },

    deleteByFazendaId: async function (fazenda_id) {
        try {
            const pivos = await module.exports.getByFazendaId(fazenda_id)
            for (pivo in pivos) pivo.destroy()

            return 1;
        } catch (err) {
            console.log('[HELPERS/PIVOS/DELETEBYFAZENDAID]: ' + err.message)
            throw err
        }
    }
}