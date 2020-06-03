module.exports = (sequelize, DataTypes) => {
    const Agendamento = sequelize.define('agendamentos', {
        agendamento_pivo_id: {
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
            allowNull: false
        },
        date_on: {
            type: DataTypes.DATE,
            required: true
        },
        date_off: {
            type: DataTypes.DATE,
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
    return Agendamento;
};