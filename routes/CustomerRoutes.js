const express = require('express');
const router=express.Router();
const customerContoller=require('../controller/customerController');

router.post('/create-customer',customerContoller.createCustomer);
router.get('/get-all-customers',customerContoller.findAllCustomers);
router.get('/get-customer/:id',customerContoller.findCustomerById);
router.put('/update-customer/:id',customerContoller.updateCustomer);
router.delete('/delete-customer/:id',customerContoller.deleteCustomer);

module.exports = router;