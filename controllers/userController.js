const userService = require('../services/userServices');
const config = require('../config/config');
const { COMMON, USER } = require('../constants/responseConstants');
const { BadRequestError } = require('../utils/errorUtils')

/**
 * Register user in DB
 * @function register
 * @param {object} req
 * @param {object} res
 */
exports.register = async (req, res) => {
    try {
        const data = req.body;
        const user = await userService.register(data);
        return responseUtil.response(res, HTTP_STATUS.CREATED, user, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * login user
 * @function login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
    try {
        const data = req.body;
        const result = await userService.login(data);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Get all users
 * @function getusers
 * @param {object} req
 * @param {object} res
 */
exports.getusers = async (req, res) => {
    try {
        const limit = req.query && req.query.limit ? Number(req.query.limit) : config.limit;
        const pageNumber = req.query && req.query.pageNumber ? Number(req.query.pageNumber) : config.pageNumber;

        const result = await userService.getAllUsers(limit, pageNumber);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Get user details by id
 * @function getUserById
 * @param {object} req
 * @param {object} res
 */
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(USER.ID_REQUIRED));
        }
        const result = await userService.getUserById(id);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Get all users
 * @function getusers
 * @param {object} req
 * @param {object} res
 */
exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(USER.ID_REQUIRED));
        }

        const result = await userService.updateUserById(id, data);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Upload Profile Pic
 * @function uploadProfilePic
 * @param {object} req
 * @param {object} res
 */
exports.uploadProfilePic = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(USER.ID_REQUIRED));
        }

        const result = await userService.uploadProfilePic(req, res, id);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}