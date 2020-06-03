module.exports = (sequelize, DataTypes) => {
    const Intencao = sequelize.define('intencoes', {
        intencao_pivo_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        on_off: {
            type: DataTypes.INTEGER(2),
            allowNull: false
        },
        front_back: {
            type: DataTypes.INTEGER(2),
            allowNull: false
        },
        water: {
            type: DataTypes.INTEGER(2),
            allowNull: false
        },
        percent: {
            type: DataTypes.INTEGER,
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
    return Intencao;
};