const express = require('express');
const OrderController = require('../controller/orderController');
const  router  = require('./ProductRoutes');


router.post('/create-order', OrderController.createOrder);
router.get('/all-order',OrderController.getAllOrders);
router.get('/get-by-id/:id',OrderController.getOrderById);
router.delete('/delete-order/:id',OrderController.deleteOrder);
router.get('/all-orders-by-customerid/:customerId',OrderController.getOrderbyCustomerid);
router.get('/orders-by-date/:date',OrderController.getOrdersByDate);
router.get('/revenue-by-date/:date',OrderController.getTotalRevenueByDate);
router.get('/most-frq',OrderController.getMostFrequentProduct);
router.get('out-of-stock',OrderController.getOutOfStockProducts);
router.get('/count-customer',OrderController.getTotalCustomers);
router.get('/customer-not-Ordered',OrderController.getCustomersWithoutOrders);

module.exports=router;
