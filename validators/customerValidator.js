const Joi = require('joi');
const { BadRequestError, handleError } = require('../utils/errorUtils')

const payloadValidator = {
    add: Joi.object().keys({
        email: Joi.string(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        mobile_number: Joi.number().required()
    }),
}

exports.customerPayloadValidator = (type) => {
    return (req, res, next) => {
        const { error, value } = payloadValidator[type].validate(req.body);
        if (error) {
            return handleError(res, new BadRequestError(error.message));
        } else {
            req.body = value;
            next();
        }
    }
}