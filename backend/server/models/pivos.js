module.exports = (sequelize, DataTypes) => {
    const Pivo = sequelize.define('pivos', {
        modulo_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        pivo_name: {
            type: DataTypes.INTEGER(11), //TODO Mudar para string
            required: true
        },

        map_x: {
            type: DataTypes.DOUBLE,
            required: true
        },

        map_y: {
            type: DataTypes.DOUBLE,
            required: true
        },

        radius: {
            type: DataTypes.INTEGER(3),
            required: true
        },

        start_angle: {
            type: DataTypes.INTEGER(3),
            required: true
        },

        end_angle: {
            type: DataTypes.INTEGER(3),
            required: true
        },

        counter_clockwise: {
            type: DataTypes.BOOLEAN,
            required: true
        },
        latitude_pivo: {
            type: DataTypes.STRING(15),
            required: true
        },
        longitude_pivo: {
            type: DataTypes.STRING(15),
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
    return Pivo;
};