
class ValidationError extends Error {
    constructor(message) {
        super(`Faltando informações (ou estao undefined) no body da sua requisição: ${message}`)
        this.name = "ValidationError";
    }
}

module.exports = ValidationError; 