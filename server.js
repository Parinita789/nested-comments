'use strict';

global.errorUtil = require('./utils/errorUtils');
global.responseUtil = require('./utils/responseUtils');
global.logger = require('./utils/loggerUtil').logger;
global.HTTP_STATUS = require('http-status');

const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const config = require('./config/config');
const db = require('./db/dbConnection');

const dbconnection = config.dbUrl;
// 'mongodb://127.0.0.1:27017/smm'
const PORT = process.env.PORT || 3000;

db.connect(dbconnection, config.options);

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://smm-customer-frontend.s3-website.ap-south-1.amazonaws.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(require('./routes'));

app.listen(PORT, () => {
    console.log(`app successfully running on port ${PORT}`);
})



