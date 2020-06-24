module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define('status_pivos', {
        status_pivo_id: {
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
            type: DataTypes.STRING(2),
            allowNull: true
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
            type: DataTypes.INTEGER(2),
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
    return Status;
};