const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const { userPayloadValidator } = require('../validators/userValidator');
const { verifyToken } = require('../middleware/tokenMiddleware');

// un secured routes
router.post('/register', userPayloadValidator('register'), userController.register);
router.post('/login', userPayloadValidator('login'), userController.login);

// Secured routes
router.get('/', verifyToken, userController.getusers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.put('/:id/upload', verifyToken, userController.uploadProfilePic);

module.exports = router;