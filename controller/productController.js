const ProductModel = require("../models/ProductModel");

// Create and Save a new Product
const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const ProductObj = new ProductModel({ name, price, stock });
    await ProductObj.save();
    res
      .status(201)
      .json({ message: "Product created successfully", data: ProductObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong", error });
  }
};

//get all products

const getAllProducts = async (req, res) => {
  try {
    const product = await ProductModel.find();
    res.status(200).json({ message: "All products", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong", error });
  }
};

//get by id

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product found", data: product });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

//product update

const updateProduct = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const ProductObj = await ProductModel.findByIdAndUpdate(id,{name,price,stock},{new:true});
    if (!ProductObj) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated", data: ProductObj });
    
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

//delete product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted", data: product });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

module.exports = { createProduct, getAllProducts, getProductById ,updateProduct,deleteProduct};
