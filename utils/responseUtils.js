
exports.response = (res, code, data, message) => {
    let returnResponse = {
        status: code,
        message: message
    }
    if (code === HTTP_STATUS.OK || code === HTTP_STATUS.CREATED) {
        returnResponse.data = data
    }
    res.status(code).json(returnResponse).end();
}
