module.exports = (sequelize, DataTypes) => {
    const Historico = sequelize.define('historicos', {
        historico_pivo_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        on_off: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        front_back: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        water: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        percent: {
            type: DataTypes.INTEGER(3),
            required: true
        },
        volt: {
            type: DataTypes.INTEGER(3),
            required: true
        },
        pressure: {
            type: DataTypes.INTEGER(3),
            required: true
        },
        fail: {
            type: DataTypes.INTEGER(3),
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
    return Historico;
};