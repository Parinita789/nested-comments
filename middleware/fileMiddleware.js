const multer = require('multer');

module.exports.CSVFileMiddleware = multer({
    storage: multer.memoryStorage({
        destination: function (req, file, callback) {
            callback('');
        }
    })
}).array('file');