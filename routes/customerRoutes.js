const express = require('express')
const router = express.Router();
const customerController = require('../controllers/customerController');
const { customerPayloadValidator } = require('../validators/customerValidator');
const { verifyToken } = require('../middleware/tokenMiddleware');
const { CSVFileMiddleware } = require('../middleware/fileMiddleware');

// Secured routes
router.post('/add/csv', verifyToken, CSVFileMiddleware, customerController.addCustomerViaCSV);
router.post('/add', verifyToken, customerPayloadValidator('add'), customerController.saveCustomer);
router.get('/all', verifyToken, customerController.getAllCustomers);
router.get('/:id', verifyToken, customerController.getCustomerById);
router.put('/:id', verifyToken, customerController.updateCustomer);
router.delete('/:id', verifyToken, customerController.deleteCustomer);

module.exports = router;