const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema=new mongoose.Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'Customer',
        required:true,
    },
    product:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
        },
    }],
    totalAmount:{
        type:Number,
        required:true,
    },
    orderData:{
        type:Date,
        default:Date.now,
    },
});

const Order=mongoose.model('Order',OrderSchema);
module.exports=Order;