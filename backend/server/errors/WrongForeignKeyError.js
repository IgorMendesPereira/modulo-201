
class WrongForeignKeyError extends Error {
    constructor(message) {
        super(message)
        this.name = "WrongForeignKeyError";
    }
}

module.exports = WrongForeignKeyError; 