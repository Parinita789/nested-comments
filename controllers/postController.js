const postService = require('../services/postServices');

exports.createPost = async (req, res) => {
    try {
        let data = req.body;
        await postService.createPost(data);
        return responseUtil.response(res, HTTP_STATUS.CREATED, {}, RESPONSE_CONSTANT.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CONSTANT.INTERNAL_SERVER_ERROR);
    }
}

exports.getPosts = async (req, res) => {
    try {
        let limit = Number(req.query.limit);
        let pageNumber = Number(req.query.page);
        let results = await postService.getPosts(limit, pageNumber);
        return responseUtil.response(res, HTTP_STATUS.OK, results, RESPONSE_CONSTANT.SUCCESS);
    } catch (err) {
        return errorUtil.handleError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CONSTANT.INTERNAL_SERVER_ERROR);
    }
}