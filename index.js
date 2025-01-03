const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

const customerRoutes = require("./routes/CustomerRoutes");
const productRoutes = require("./routes/ProductRoutes");

dotenv.config();

app.use(express.urlencoded({ extended: false })); // Built-in body-parser replacement
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/customer", customerRoutes);
app.use("/product", productRoutes);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
