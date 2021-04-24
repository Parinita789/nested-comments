const async = require("async");
const Customer = require('../models/customerSchema');
const Counter = require('../models/counterSchema');
const { CUSTOMER, COMMON } = require('../constants/responseConstants');
const { NotAcceptableError, NotFoundError, InternalServerError } = require('../utils/errorUtils');

/**
 * Save user in DB
 * @function createUser
 * @param {object} data
 */
function createCustomer(data) {
    return new Promise((resolve, reject) => {
        const newCustomer = new Customer(data);
        newCustomer.save().then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Get the id for the customer
 * @function getNextSequence
 * @param {Strng} name
 */
function getNextSequence(name) {
    return new Promise((reolve, reject) => {
        let update = { $inc: { seq: 1 } };
        let option = {
            new: true
        }
        Counter.findByIdAndUpdate(name, update, option)
            .then(result => {
                console.log("result >>> ", result)
                reolve(result.seq)
            })
            .catch(err => {
                console.log("err >>> ", err)
                reject(err);
            });
    })
}

/**
 * decrease the id for the customer
 * @function decreaseSequence
 * @param {Strng} name
 */
function decreaseSequence(name) {
    return new Promise((reolve, reject) => {
        let update = { $inc: { seq: -1 } };
        let option = {
            new: true
        }
        Counter.findByIdAndUpdate(name, update, option)
            .then(result => {
                reolve(result.seq)
            })
            .catch(err => {
                reject(err);
            });
    })
}

/**
 * Get user by email
 * @function getUserByEmail
 * @param {string} email
 */
function find(query) {
    return new Promise((resolve, reject) => {
        Customer.findOne(query)
            .then(user => {
                resolve(user)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Update User
 * @function updateCustomer
 * @param {string} id
 * @param {object} data
 */
function updateCustomer(id, data) {
    return new Promise((resolve, reject) => {
        Customer.findByIdAndUpdate(id, data)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * delete User
 * @function deleteCustomerById
 * @param {string} id
 */
function deleteCustomerById(id) {
    return new Promise((resolve, reject) => {
        Customer.findByIdAndDelete(id)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Save user in DB
 * @function register
 * @param {object} data
 */
exports.saveCustomer = async (data) => {
    try {
        // check if user is already registered
        let query = { mobileNumber: data.mobile_number };
        let customer = await find(query);
        if (customer) {
            throw new NotAcceptableError(CUSTOMER.ALREADY_EXIST)
        } else {
            data.id = await getNextSequence("customer_id");
            let result = await createCustomer(data);
            return result;
        }
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw err;
    }
}

async function getCustomerCount() {
    try {
        Customer.count({}, (err, count) => {
            if (err) {
                throw err;
            } else {
                return count;
            }
        })
    } catch (err) {
        throw err;
    }
}

/**
 * Get all customers from DB
 * @function getAllCustomer
 * @param {number} limit
 * @param {number} pageNo
 */
exports.getAllCustomer = async (data, limit, pageNo) => {
    try {
        let skip = (pageNo * 10) - limit;
        let fields = { id: 1, created_at: 1, first_name: 1, last_name: 1, mobile_number: 1, _id: 1 };
        let filter = data ? { $or: [{ first_name: data }, { last_name: data }, { phone_number: data }] } : {};

        let customers = await Customer.find(filter, fields).skip(skip).limit(limit);

        let count = await getCustomerCount();

        if (customers && customers.length < 0) {
            throw new NotFoundError(CUSTOMER.NOT_FOUND)
        } else {
            let data = {
                pageNo: pageNo,
                itemsPerpage: limit,
                totalItems: count,
                items: customers
            }
            return data;
        }
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw err;
    }
}

/**
 * Get customer by id from DB
 * @function getCustomerById
 * @param {string} id
 */
exports.getCustomerById = async (id) => {
    try {
        let query = { _id: id };
        let customer = await find(query);
        if (!customer) {
            throw new NotFoundError(CUSTOMER.NOT_FOUND)
        } else {
            return customer;
        }
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw err;
    }
}

/**
 * Update Customer by Id
 * @function updateCustomerById
 * @param {string} id
 * @param {object} data
 */
exports.updateCustomerById = async (id, data) => {
    try {
        let result = await updateCustomer(id, data);
        return result;
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw new InternalServerError(COMMON.INTERNAL_SERVER_ERROR)
    }
}

/**
 * Delete Customer by Id
 * @function deleteCustomer
 * @param {string} id
 */
exports.deleteCustomer = async (id, data) => {
    try {
        await decreaseSequence("customer_id")
        let result = await deleteCustomerById(id);
        return result;
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw new InternalServerError(COMMON.INTERNAL_SERVER_ERROR)
    }
}

/**
 * Delete Customer by Id
 * @function addCustomerViaCSV
 * @param {Array} customers
 */
exports.addCustomerViaCSV = async (customers) => {
    return new Promise((resolve, reject) => {
        let data = {
            success: [],
            failure: []
        }
        async.forEach(customers, (customer, cb) => {
            if (customer) {
                this.saveCustomer(customer)
                    .then(result => {
                        data.success.push(customer.first_name);
                        cb(null, {});
                    })
                    .catch(err => {
                        data.failure.push(customer.first_name);
                        cb(err, null)
                    })
            } else {
                cb();
            }
        }, (err, result) => {
            resolve(null, data)
        })
    })
}

