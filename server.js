'use strict';

global.errorUtil = require('./utils/errorUtils');
global.responseUtil = require('./utils/responseUtils');
global.logger = require('./utils/loggerUtil').logger;
global.ERROR_CONSTANT = require('./constants/errorConstants');
global.RESPONSE_CONSTANT = require('./constants/responseConstants');
global.HTTP_STATUS = require('http-status');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const config = require('./config/config');
const db = require('./db/dbConnection');

const dbconnection = config.DB_URL;
const PORT = process.env.PORT || 3000;

db.connect(dbconnection, config.options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('./routes'));

app.listen(PORT, () => {
    console.log(`app successfully running on port ${PORT}`);
})



