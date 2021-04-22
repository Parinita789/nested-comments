const customerService = require('../services/customerService');
const config = require('../config/config');
const { COMMON, CUSTOMER, CSV } = require('../constants/responseConstants');
const { addDataViaFile } = require('../helper/csvHelper');
const { BadRequestError } = require('../utils/errorUtils')

/**
 * Save customer
 * @function saveCustomer
 * @param {object} req
 * @param {object} res
 */
exports.saveCustomer = async (req, res) => {
    try {
        const data = req.body;

        const result = await customerService.saveCustomer(data);

        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Get all customers
 * @function getAllCustomers
 * @param {object} req
 * @param {object} res
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const limit = req.query && req.query.limit ? Number(req.query.limit) : config.limit;
        const pageNumber = req.query && req.query.page ? Number(req.query.page) : config.pageNumber;
        const param = req.query && req.query.search ? req.query.search : undefined;
        const result = await customerService.getAllCustomer(param, limit, pageNumber);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Get customer details by id
 * @function getCustomerById
 * @param {object} req
 * @param {object} res
 */
exports.getCustomerById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(CUSTOMER.ID_REQUIRED));
        }
        const result = await customerService.getCustomerById(id);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Update Customer by id
 * @function updateCustomer
 * @param {object} req
 * @param {object} res
 */
exports.updateCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(CUSTOMER.ID_REQUIRED));
        }

        const result = await customerService.updateCustomerById(id, data);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Delete Customer by id
 * @function deleteCustomer
 * @param {object} req
 * @param {object} res
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (!id) {
            return errorUtil.handleError(res, new BadRequestError(CUSTOMER.ID_REQUIRED));
        }

        const result = await customerService.deleteCustomer(id, data);
        return responseUtil.response(res, HTTP_STATUS.OK, result, COMMON.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}

/**
 * Add customer through csv
 * @function addCustomerViaCSV
 * @param {object} req
 * @param {object} res
 */
exports.addCustomerViaCSV = async (req, res) => {
    try {

        const files = req.files;
        if (files.length > 0) {
            addDataViaFile(files, (err, customerList) => {
                if (err) {
                    return errorUtil.handleError(res, err);
                } else {
                    if (customerList.validData && customerList.validData.length > 0) {
                        customerService.addCustomerViaCSV(customerList.validData).then(data => {
                            data.failure = customerList.invalidData ? data.failure.concat(customerList.invalidData) : data.failure;
                            return responseUtil.response(res, HTTP_STATUS.OK, data, COMMON.SUCCESS);
                        }).catch(err => {
                            return errorUtil.handleError(res, err);
                        });
                    } else {
                        return errorUtil.handleError(res, new BadRequestError('No valid data provided.'));
                    }
                }
            })
        } else {
            return errorUtil.handleError(res, new BadRequestError(CSV.PROVIDE_CSV_FILE));
        }
    } catch (err) {
        return errorUtil.handleError(res, err);
    }
}