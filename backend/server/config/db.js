const Sequelize = require('sequelize');

const sequelize = new Sequelize('soildb', 'soil', 'password', {
    //host: 'soildb.cdfsr0wfegop.us-east-1.rds.amazonaws.com',
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    timezone: "America/Sao_Paulo",
    logging: false,
    dialectOptions: {
        useUTC: false, // for reading from database
        typeCast: function (field, next) { // for reading from database
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        },
    },
    define: {
        underscored: true // Faz com que as chaves geradas automaticamente (ex: foreign key)
        //seja gerada como 
    }
});

/* Conecta todos os models no banco de dados ao objeto db,
para que tudo seja acessivel via somente esse objeto */

const db = {}

db.sequelize = sequelize;
db.usuarios = require('../models/usuarios.js')(sequelize, Sequelize)
db.fazendas = require('../models/fazendas.js')(sequelize, Sequelize)
db.pivos = require('../models/pivos.js')(sequelize, Sequelize)
db.status_pivos = require('../models/status_pivos.js')(sequelize, Sequelize)
db.historicos = require('../models/historicos.js')(sequelize, Sequelize)
db.agendamentos = require('../models/agendamentos.js')(sequelize, Sequelize)
db.intencoes = require('../models/intencoes.js')(sequelize, Sequelize)

//Relations
db.fazendas.hasMany(db.pivos, { foreignKey: 'fazenda_id', onDelete: 'CASCADE' });
db.usuarios.hasMany(db.fazendas, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
db.pivos.hasOne(db.status_pivos, { foreignKey: 'modulo_id', onDelete: 'CASCADE' });
db.pivos.hasOne(db.historicos, { foreignKey: 'modulo_id', onDelete: 'CASCADE' });
db.pivos.hasOne(db.agendamentos, { foreignKey: 'modulo_id', onDelete: 'CASCADE' });
db.pivos.hasOne(db.intencoes, { foreignKey: 'modulo_id', onDelete: 'CASCADE' });

module.exports = db;