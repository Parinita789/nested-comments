let utils = {};

utils.empty = (mixedVar) => {
    let undef, key, i, len;
    let emptyValues = [undefined, "undefined", null, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};

utils.validPhoneNumber = (mobileNumber) => {
    var mob = /^[1-9]{1}[0-9]{9}$/;
    return mob.test(mobileNumber);
};

module.exports = utils;
