const db = require('../config/db')
const validator = require('validator')
const DuplicateError = require('../errors/DuplicateError')
const ValidationError = require('../errors/ValidationError')
const helpers = {
    fazendas: require('./fazendas')
}

module.exports = {
    getAll: async function () {
        try {
            const usuarios = await db.usuarios.findAll()

            return usuarios
        } catch (err) {
            console.log('[HELPERS/USUARIOS/GETALL]: ' + err.message)
            throw err
        }
    },

    getByLogin: async function (login) {
        try {
            const usuarios = await db.usuarios.findAll({ where: { login: login } })

            return usuarios
        } catch (err) {
            console.log('[HELPERS/USUARIOS/GETBYLOGIN]: ' + err.message)
            throw err
        }
    },

    getByUsuarioId: async function (usuario_id) {
        try {
            const usuario = await db.usuarios.findAll({ where: { usuario_id: usuario_id } })

            return usuario
        } catch (err) {
            console.log('[HELPERS/USUARIOS/GETALL]: ' + err.message)
            throw err
        }
    },

    post: async function (body) {
        try {
            const { login, hash, tipo_user } = body
            for (attribute in body) {
                const str = body[attribute].toString()
                if (str.trim().length === 0) throw new ValidationError(attribute)
            }

            const usuarios = await module.exports.getByLogin(login)
            if (usuarios.length > 0) throw new DuplicateError("Um usuario com esse Login ja foi criado!")

            const usuario = await db.usuarios.create({
                login: login,
                senha: hash,
                tipo_user: tipo_user
            })

            return usuario
        } catch (err) {
            console.log('[HELPERS/USUARIOS/POST]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    },

    deleteByUsuarioId: async function (usuario_id) {
        try {
            const deletedUsuario = await db.usuarios.destroy({
                where: { usuario_id: usuario_id }
            })

            const deleted = await helpers.fazendas.deleteByUsuarioId(usuario_id)

            return { usuarios: deletedUsuario, fazendas: deleted }
        } catch (err) {
            console.log('[HELPERS/USUARIOS/POST]: ' + `[${err.name}] ` + err.message)
            throw err
        }
    }
}
