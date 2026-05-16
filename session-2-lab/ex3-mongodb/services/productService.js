const Product = require("../models/Product");

async function createProduct(data) {
  const existing = await Product.findOne({ slug: data.slug });
  if (existing) throw new Error("Slug already in use");
  return Product.create(data);
}

async function getAvailableProducts() {
  return Product.find({ inStock: true }).lean();
}

async function discontinue(slug) {
  const product = await Product.findOneAndUpdate(
    { slug },
    { inStock: false },
    { returnDocument: "after" }
  );
  if (!product) throw new Error("Product not found");
  return product;
}

module.exports = { createProduct, getAvailableProducts, discontinue };
