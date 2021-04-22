const csv = require('fast-csv')
const { BadRequestError, InternalServerError } = require('../utils/errorUtils');
const { CSV, COMMON } = require('../constants/responseConstants');
const { empty, validPhoneNumber } = require('../utils/utils');

exports.addDataViaFile = (files, callback) => {
    try {
        let isError = false;
        let validData = [];
        let invalidData = [];
        let obj = {
            invalidData: invalidData,
            validData: validData
        }
        if (files.length > 0) {
            const item = files[0];
            let texts = (new Buffer.from(item.buffer)).toString('utf8');
            csv.parseString(texts, { headers: true, ignoreEmpty: true })
                .validate((row, cb) => {
                    row.createdAt = Number(new Date().getTime());
                    const isInValid = checkCustomerDetials(row);
                    if (isInValid) {
                        invalidData.push(row)
                        cb()
                    } else {
                        validData.push(row)
                        cb()
                    }
                })
                .on('error', err => {
                    invalidData.push(row)
                })
                .on('data-invalid', (row, rowNumber) => {
                    invalidData.push(row);
                })
                .on('data', (row) => {
                    validData.push(row)
                })
                .on('end', rowCount => {
                    console.log(`No of rows parsed ${rowCount}.`, isError);
                    callback(null, obj);
                });
        } else {
            callback(new BadRequestError(CSV.PROVIDE_CSV_FILE), null)
        }
    } catch (err) {
        logger.log('error', 'err addDataViaFile ', { err: err })
        callback(new InternalServerError(COMMON.INTERNAL_SERVER_ERROR), null)
    }
};

/**
* @function checkCustomerDetials
* @param {string} row
*/
function checkCustomerDetials(row) {
    if (empty(row.mobile_number) || !validPhoneNumber(row.mobile_number)) {
        return true;
    }
    if (empty(row.first_name)) {
        return true;
    }
    if (empty(row.last_name)) {
        return true;
    }
}