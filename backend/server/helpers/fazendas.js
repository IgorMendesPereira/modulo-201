const db = require('../config/db')

module.exports = {

    getById: function (fazenda_id) {
        var promise = new Promise((resolve, reject) => {
            db.intencoes.findAll({
                where: { fazenda_id: fazenda_id }
            })
                .then(concentrador_id => {
                    resolve(concentrador_id)
                });
        })
        return promise
    },
}