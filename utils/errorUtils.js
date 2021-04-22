exports.handleError = (res, err) => {
    let code;
    switch (err.constructor) {
        case this.NotFoundError:
            code = HTTP_STATUS.NOT_FOUND;
            break;
        case this.UnauthorizedError:
            code = HTTP_STATUS.UNAUTHORIZED
            break;
        case this.UnprocessableEntityError:
            code = HTTP_STATUS.UNPROCESSABLE_ENTITY;
            break;
        case this.NotAcceptableError:
            code = HTTP_STATUS.NOT_ACCEPTABLE
            break;
        default:
            code = HTTP_STATUS.INTERNAL_SERVER_ERROR
            break;
    }
    response = {
        status: code,
        message: err.message
    };
    return res.status(code).json(response).end();
}
exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.InternalServerError = class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.UnprocessableEntityError = class UnprocessableEntityError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.NotAcceptableError = class NotAcceptableError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.UnauthorizedError = class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}

exports.BadRequestError = class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
