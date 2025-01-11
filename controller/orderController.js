const CustomerModel = require("../models/CustomerModel");
const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");



const createOrder = async (req, res) => {
  try {
    const { customerId, products } = req.body;

    if (!customerId || !products || !Array.isArray(products)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let totalAmount = 0;

    // Validate customer
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    for (const item of products) {
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: "Not enough product in stock" });
      }

      totalAmount += product.price * item.quantity;

      product.quantity -= item.quantity;
      await product.save();
    }

    const orderObject = new OrderModel({
      customerId,
      product: products,
      totalAmount,
    });

    await orderObject.save();

    res.status(201).json({ message: "Order created successfully", order: orderObject });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//get all orders

const getAllOrders=async (req,res)=>{
  try {
    const OrderObj=await OrderModel.find();
    if (!OrderObj) {
      return res.status(400).json({ message: "No orders found" });
    }
    res.status(200).json({data:OrderObj})
  } catch (error) {
    res.status(500).json({message:"something went wrong",error});
  }
}

//get order by id

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params; // Fixed typo here
    const OrderObj = await OrderModel.findById(id);

    if (!OrderObj) {
      return res.status(404).json({ message: "Order not found" }); 
    }

    res.status(200).json({ data: OrderObj });
  } catch (error) {
    
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

//delete order
const deleteOrder = async (req, res) => {
  try {
    const {id}=req.params;
    const OrderObj=await OrderModel.findByIdAndDelete(id);

    if(!OrderObj){
      return res.status(404).json({message:"Order not found"});
    }
    res.status(200).json({message:"Order deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}




module.exports = { createOrder,getAllOrders,getOrderById,deleteOrder};
