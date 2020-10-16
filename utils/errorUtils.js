
exports.handleError = (res, code, message) => {
    let response = {};
    response = {
        status: code,
        message: message
    };
    return res.status(code).json(response).end();
}