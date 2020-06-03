module.exports = (sequelize, DataTypes) => {
    const Fazenda = sequelize.define('fazendas', {
        fazenda_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        propriedade: {
            type: DataTypes.STRING(22),
            required: true
        },
        cidade: {
            type: DataTypes.STRING(22),
            required: true
        },
        concentrador_id: {
            type: DataTypes.STRING(22),
            required: true
        },
        latitude_fazenda: {
            type: DataTypes.STRING(22),
            required: true
        },
        longitude_fazenda: {
            type: DataTypes.STRING(22),
            required: true
        },
        time_stamp: {
            type: DataTypes.DATE,
            defaultValue: Date.now
        },
    }, {
        paranoid: false,
        underscored: true
    });
    return Fazenda;
};