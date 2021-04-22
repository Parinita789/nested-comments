const jwt = require('jsonwebtoken');
const jwtKey = require('../config/config').jwtKey;
const { UnauthorizedError, InternalServerError } = require('../utils/errorUtils');
const { COMMON } = require('../constants/responseConstants');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return errorUtil.handleError(res, new UnauthorizedError(COMMON.UNAUTHORIZED));
        } else {
            jwt.verify(token, jwtKey, (err, result) => {
                if (err) {
                    return errorUtil.handleError(res, new UnauthorizedError(COMMON.UNAUTHORIZED));
                } else {
                    req.user = result;
                    next();
                }
            })
        }
    } catch (err) {
        return errorUtil.handleError(res, new InternalServerError(COMMON.INTERNAL_SERVER_ERROR));
    }
}