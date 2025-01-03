const express = require('express');
const router=express.Router();
const ProductController=require('../controller/productController');

router.post('/create-product',ProductController.createProduct);
router.get('/get-all-products',ProductController.getAllProducts);
router.get('/get-product-by-id/:id',ProductController.getProductById);
router.put('/update-product/:id',ProductController.updateProduct);
router.delete('/delete-product/:id',ProductController.deleteProduct);
module.exports = router;