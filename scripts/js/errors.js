export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError";
    }
}
