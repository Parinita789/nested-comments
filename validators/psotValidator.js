const Joi = require('joi');

const payloadValidator = {
    add: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        authorId: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number()
    })
}

exports.postPayloadValidator = (type) => {
    return (req, res, next) => {
        const { error, value } = payloadValidator[type].validate(req.body);
        if (error) {
            return errorUtil.handleError(res, HTTP_STATUS.BAD_REQUEST, error.message);
        } else {
            req.body = value;
            next();
        }
    }
}