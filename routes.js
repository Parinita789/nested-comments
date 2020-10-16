const express = require('express')
const router = express.Router();
console.log("routes initializing..");
const SECURE = '/secure';

router.use(`${SECURE}/post`, require('./routes/postRoutes'));

router.all('/*', function (req, res) {
    let response = {
        status: 404,
        message: "Route Not Found"
    }
    return res.json(response);
});

module.exports = router