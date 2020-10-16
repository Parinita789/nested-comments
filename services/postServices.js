const { v4: uuidv4 } = require('uuid');
const Post = require('../models/postSchema');

exports.createPost = (data) => {
    return new Promise((resolve, reject) => {
        data.id = uuidv4();
        const newPost = new Post(data);
        newPost.save().then(result => {
            resolve('success')
        }).catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            reject(err)
        })
    })
}

exports.getPosts = (limit, pageNo) => {
    return new Promise((resolve, reject) => {
        let skip = (pageNo * 10) - limit;
        Post.find().skip(skip).limit(limit).then(posts => {
            if (posts.length < 0) {
                let err = {
                    code: HTTP_STATUS.NOT_FOUND,
                    message: ERROR_CONSTANT.POST.NOT_FOUND
                }
                reject(err);
            } else {
                let data = {
                    pageNo: pageNo,
                    itemsPerpage: limit,
                    items: posts
                }
                resolve(data)
            }
        }).catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            err = {
                code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: ERROR_CONSTANT.COMMON.INTERNAL_SERVER_ERROR
            }
            reject(err)
        })
    })
}