const Joi = require('joi');
const { BadRequestError } = require('../utils/errorUtils');

const payloadValidator = {
    register: Joi.object().keys({
        user_name: Joi.string().required(),
        email: Joi.string().required(),
        mobile_number: Joi.string().required(),
        password: Joi.string().required()
    }),
    login: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
    add: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    }),
}

exports.userPayloadValidator = (type) => {
    return (req, res, next) => {
        const { error, value } = payloadValidator[type].validate(req.body);
        if (error) {
            return errorUtil.handleError(res, new BadRequestError(error.message));
        } else {
            req.body = value;
            next();
        }
    }
}