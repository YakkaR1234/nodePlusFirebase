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
        return res
          .status(400)
          .json({ message: `Product with ID ${item.productId} not found` });
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

    res
      .status(201)
      .json({ message: "Order created successfully", order: orderObject });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//get all orders

const getAllOrders = async (req, res) => {
  try {
    const OrderObj = await OrderModel.find();
    if (!OrderObj) {
      return res.status(400).json({ message: "No orders found" });
    }
    res.status(200).json({ data: OrderObj });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

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
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

//delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const OrderObj = await OrderModel.findByIdAndDelete(id);

    if (!OrderObj) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getOrderbyCustomerid = async (req, res) => {
  try {
    const { customerId } = req.params;
    const Orders = await OrderModel.find({ customerId }).populate(
      "product.productId"
    );

    if (Orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }
    res.status(200).json({ data: Orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getOrdersByDate = async (req, res) => {
  try {
    const { date } = req.params; 
    
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

   
    const orders = await OrderModel.find({
      orderData: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate("product.productId");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the given date" });
    }

    res.status(200).json({ data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getTotalRevenueByDate = async (req, res) => {
  try {
    const { date } = req.params; 

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const start = new Date(date); 
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); 

  
    const revenue = await OrderModel.aggregate([
      {
        $match: {
          orderData: { $gte: start, $lte: end }, 
        },
      },
      {
        $group: {
          _id: null, 
          totalRevenue: { $sum: "$totalAmount" }, 
        },
      },
    ]);

    res.status(200).json({ totalRevenue: revenue[0]?.totalRevenue || 0 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getMostFrequentProduct = async (req, res) => {
  try {
    const result = await OrderModel.aggregate([
      { $unwind: "$product" },
      { $group: { _id: "$product.productId", count: { $sum: "$product.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ mostFrequentProduct: result[0] });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ quantity: { $lte: 0 } });

    if (products.length === 0) {
      return res.status(404).json({ message: " product not found" });
    }

    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

//total customers
const getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await CustomerModel.countDocuments();
    res.status(200).json({ totalCustomers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getCustomersWithoutOrders = async (req, res) => {
  try {
    const customers = await CustomerModel.find({
      _id: { $nin: await OrderModel.distinct("customerId") }
    });

    if (customers.length === 0) {
      return res.status(404).json({ message: "All customers have placed orders" });
    }

    res.status(200).json({ data: customers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};





module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  getOrderbyCustomerid,
  getOrdersByDate,
  getTotalRevenueByDate,
  getMostFrequentProduct,
  getOutOfStockProducts,
  getTotalCustomers,
  getCustomersWithoutOrders
};
