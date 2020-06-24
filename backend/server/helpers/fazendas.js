const validator = require('validator')
const db = require('../config/db')
const ValidationError = require('../errors/ValidationError')
const WrongForeignKeyError = require('../errors/WrongForeignKeyError')

const helpers = {
    pivos: require('./pivos')
}

const socket = require('../socket')

module.exports = {

    getAll: async function () {
        try {
            const fazendas = await db.fazendas.findAll()

            return fazendas
        } catch (err) {
            console.log('[HELPERS/FAZENDAS/GETALL]: ' + err.message)
            throw err
        }
    },

    getByUsuarioId: async function (usuario_id) {
        try {
            const fazendas = await db.fazendas.findAll({
                where: { usuario_id: usuario_id }
            })

            return fazendas
        } catch (err) {
            console.log('[HELPERS/FAZENDAS/GETBYUSUARIOID]: ' + err.message)
            throw err
        }
    },

    post: async function (body) {
        const { usuario_id, telefone, propriedade, cidade, latitude_fazenda, longitude_fazenda, concentrador_ip } = body;

        try {
            for (attribute in body) {
                const str = body[attribute].toString()
                if (str.trim().length === 0) throw new ValidationError(attribute)
            }

            const usuario = await db.usuarios.findAll({ where: { usuario_id: usuario_id } })
            if (usuario == 0) throw new WrongForeignKeyError("Usuario com esse ID não existe!")

            const fazenda = await db.fazendas.create({
                usuario_id, telefone, propriedade, cidade, latitude_fazenda, longitude_fazenda, concentrador_ip
            })

            socket.emit('update_fazendas', { error: false, msg: "Fazenda adicionada" })

            return fazenda
        } catch (err) {
            socket.emit('update_fazendas', { error: true, msg: "Erro ao adicionar fazendas" })
            console.log('[HELPERS/FAZENDAS/POST]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    deleteByFazendaId: async function (fazenda_id) {
        try {
            const deletedFazenda = await db.fazendas.destroy({
                where: { fazenda_id: fazenda_id }
            })

            const deletedPivos = await helpers.pivos.deleteByFazendaId(fazenda_id)

            socket.emit('updated_fazendas', "Fazenda deletada")
            return { fazendas: deletedFazenda, pivos: deletedPivos }
        } catch (err) {
            socket.emit('updated_fazendas', err.message)
            console.log('[HELPERS/FAZENDAS/DELETEBYFAZENDAID]: ' + err.message)
            throw err
        }
    },

    deleteByUsuarioId: async function (usuario_id) {
        try {
            var deletedFazenda, deletedPivos = [], fazenda_ids = []

            const fazendas = await db.fazendas.findAll({ where: { usuario_id: usuario_id } })
            fazendas.forEach(fazenda => fazenda_ids.push(fazenda.fazenda_id))
            fazenda_ids.forEach(async id => {
                const deletedPivo = await helpers.pivos.deleteByFazendaId(id)
                deletedPivos.push(deletedPivo)
            })

            return { fazendas: deletedFazenda, pivos: deletedPivos }
        } catch (err) {
            console.log('[HELPERS/FAZENDAS/DELETEBYUSUARIOID]: ' + err.message)
            throw err
        }
    }
}