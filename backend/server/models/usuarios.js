module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuarios', {
    usuario_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    login: {
      type: DataTypes.STRING(25),
      required: true
    },
    senha: {
      type: DataTypes.STRING,
      required: true
    },
    tipouser: {
      type: DataTypes.ENUM,
      values: ['Administrador', 'Fazendeiro', 'Funcionario']
    },
    time_stamp: {
      type: DataTypes.DATE,
      defaultValue: Date.now
    },
  }, {
    paranoid: false,
    underscored: true
  });
  return Usuario;
}