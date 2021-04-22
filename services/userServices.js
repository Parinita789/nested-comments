const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const async = require("async");
const multer = require('multer')
const config = require('../config/config');
const User = require('../models/userSchema');
const { USER, COMMON } = require('../constants/responseConstants');
const { NotAcceptableError, NotFoundError, UnauthorizedError, InternalServerError } = require('../utils/errorUtils');
const saltRounds = Number(config.slatRounds);
const path = require('path');
const jwtKey = config.jwtKey;
const jwtExpiryTime = config.jwtExpiryTime;

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
});

/**
 * Save user in DB
 * @function createUser
 * @param {object} data
 */
function createUser(data) {
    return new Promise((resolve, reject) => {
        const newUser = new User(data);
        newUser.save().then(result => {
            resolve(result)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * Get user by email
 * @function getUserByEmail
 * @param {string} email
 */
function find(query) {
    return new Promise((resolve, reject) => {
        User.findOne(query)
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
 * @function getUserByEmail
 * @param {string} email
 */
function updateUser(id, data) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, { new: true }, data)
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * Compare password and hashed password
 * @function comparePassword
 * @param {string} data
 *  @param {string} hash
 */
function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash)
}

/**
 * Generate authorization token
 * @function generateJwtToken
 * @param {string} username
 */
function generateJwtToken(username) {
    const token = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: "1d",
    })
    return token;
}

/**
 * Generate password hash
 * @function getHashedPassword
 * @param {string} password
 */
function getHashedPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                return bcrypt.hash(password, salt);
            })
            .then(hash => {
                resolve(hash)
            })
            .catch(err => {
                reject(err.message);
            });
    })
}

/**
 * Save user in DB
 * @function register
 * @param {object} data
 */
exports.register = async (data) => {
    try {
        // check if user is already registered
        // let query = { email: data.email };
        // let user = await find(query);
        // if (user) {
        //     throw new NotAcceptableError(USER.ALREADY_EXIST)
        // } else {
            data.password = await getHashedPassword(data.password);
            let result = await createUser(data);
            return result;
        // }
    } catch (err) {
        logger.log({
            level: 'error',
            message: err.message
        });
        throw err;
    }
}

/**
 * For generating tokens
 * @function login
 * @param {object} data
 */
exports.login = async (data) => {
    try {
        // check if user is already registered
        let query = { email: data.email };
        let user = await find(query);
        if (!user) {
            throw new NotFoundError(USER.NOT_REGISTERED);
        } else {
            let isCorrectPassword = comparePassword(data.password, user.password);
            if (!isCorrectPassword) {
                throw new UnauthorizedError(USER.INCORRECT_PASSWORD);
            } else {
                let token = generateJwtToken(data.email)
                let result = { token };
                return result
            }
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
 * Get all users from DB
 * @function getAllUsers
 * @param {number} limit
 * @param {number} pageNo
 */
exports.getAllUsers = (limit, pageNo) => {
    return new Promise((resolve, reject) => {
        let skip = (pageNo * 10) - limit;
        let fields = { id: 1, created_at: 1, user_name: 1, email: 1 };

        User.find({}, fields).skip(skip).limit(limit).sort({ created_at: -1 }).then(users => {
            if (users && users.length < 0) {
                throw new NotFoundError(USER.NOT_FOUND)
            } else {
                let records = [];
                async.each(users, (user, cb) => {
                    getUrl(user.id)
                        .then(result => {
                            let obj = {
                                id: user.id,
                                user_name: user.user_name,
                                email: user.email,
                                profile_pic: result,
                                created_at: user.created_at
                            }
                            records.push(obj);
                            cb();
                        })
                }, (err, users) => {
                    let data = {
                        pageNo: pageNo,
                        itemsPerpage: limit,
                        items: records
                    }
                    resolve(data);
                })
            }
        }).catch(err => {
            logger.log({
                level: 'error',
                message: err.message
            });
            reject(err);
        });
    })
}

// exports.getAllUsers = async (limit, pageNo) => {
//     try {
//         let skip = (pageNo * 10) - limit;
//         let fields = { id: 1, created_at: 1, user_name: 1, email: 1 };
//         let users = await User.find({}, fields).skip(skip).limit(limit);
//         if (users && users.length < 0) {
//             throw new NotFoundError(USER.NOT_FOUND)
//         } else {
//             let data = {
//                 pageNo: pageNo,
//                 itemsPerpage: limit,
//                 items: records
//             }
//             return data;
//         }
//     } catch (err) {
//         logger.log({
//             level: 'error',
//             message: err.message
//         });
//         throw err;
//     }
// }

/**
 * For getting profile pic url
 * @function getUrl
 * @param {string} id
 */
function getUrl(id) {
    return new Promise((resolve, reject) => {
        let path = `v1615125981/${id}`;
        let imageUrl = cloudinary.url(path + '.png');
        if (imageUrl) {
            resolve(imageUrl);
        }
    })

}

/**
 * Get all users from DB
 * @function getAllUsers
 * @param {number} limit
 * @param {number} pageNo
 */
exports.getUserById = async (id) => {
    try {
        let query = { id: id };
        let user = await find(query);
        if (!user) {
            throw new NotFoundError(USER.NOT_FOUND)
        } else {
            let profilePic = await getUrl(user.id);
            let finalUser = {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                profile_pic: profilePic,
                created_at: user.created_at
            }
            return finalUser;
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
 * Update User by Id
 * @function getAllUsers
 * @param {number} limit
 * @param {number} pageNo
 */
exports.updateUserById = async (id, data) => {
    try {
        let result = await updateUser(id, data);
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
 * Upload Profile Pic
 * @function uploadProfilePic
 * @param {object} req
 * @param {string} idI
 */
exports.uploadProfilePic = async (req, res, id) => {
    try {
        let fileName = '';
        const storage = multer.diskStorage({
            destination: 'uploads',
            filename: function (req, file, cb) {
                fileName = `${id}`
                cb(null, fileName)
            }
        })
        // Init upload
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 1000000
            },

            fileFilter: function (req, file, cb) {
                sanitizeFile(file, cb);
            }

        }).single('file')

        upload(req, res, (err) => {
            if (err) {
                throw err(new InternalServerError(COMMON.INTERNAL_SERVER_ERROR));
            } else {
                cloudinary.uploader.upload(`${path.join(__dirname, fileName)}`,
                    { public_id: id },
                    (error, result) => {
                        return;
                    });
            }
        })
    } catch (err) {
        logger.log({
            level: 'error',
            message: err
        });
        throw err;
    }
}

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']

    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}
