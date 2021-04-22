const express = require('express')
const router = express.Router();

router.use(`/user`, require('./routes/userRoutes'));
router.use(`/customer`, require('./routes/customerRoutes'));

router.all('/*', (req, res) => {
    let response = {
        status: 404,
        message: "Route Not Found"
    }
    return res.json(response);
});

module.exports = router