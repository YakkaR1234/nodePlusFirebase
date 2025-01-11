const express = require('express');
const OrderController = require('../controller/orderController');
const  router  = require('./ProductRoutes');


router.post('/create-order', OrderController.createOrder);
router.get('/all-order',OrderController.getAllOrders);
router.get('/get-by-id/:id',OrderController.getOrderById);
router.delete('/delete-order/:id',OrderController.deleteOrder);

module.exports=router;
