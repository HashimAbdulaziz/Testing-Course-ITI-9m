const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
