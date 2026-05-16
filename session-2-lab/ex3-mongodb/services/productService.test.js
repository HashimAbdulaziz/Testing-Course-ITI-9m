const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/Product");
const { createProduct, getAvailableProducts, discontinue } = require("../services/productService");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("productService", () => {
  it("createProduct - happy path: creates and returns product with correct name, slug, and default inStock: true", async () => {
    const productData = { name: "Mechanical Keyboard", slug: "mech-kb", price: 120 };
    const product = await createProduct(productData);

    expect(product.name).toBe("Mechanical Keyboard");
    expect(product.slug).toBe("mech-kb");
    expect(product.price).toBe(120);
    expect(product.inStock).toBe(true);
  });

  it('createProduct - duplicate slug: throws "Slug already in use"', async () => {
    const productData = { name: "Laptop", slug: "macbook", price: 1000 };
    await createProduct(productData);

    await expect(createProduct(productData)).rejects.toThrow("Slug already in use");
  });

  it("createProduct - schema validation: rejects a negative price (min: 0)", async () => {
    const invalidProduct = { name: "Freebie", slug: "freebie", price: -5 };

    await expect(createProduct(invalidProduct)).rejects.toThrow(/min/i);
  });

  it("getAvailableProducts - returns only products where inStock is true", async () => {
    await Product.create([
      { name: "Mouse", slug: "mouse-1", price: 20, inStock: true },
      { name: "Monitor", slug: "monitor-1", price: 300, inStock: false },
      { name: "Desk", slug: "desk-1", price: 150, inStock: true }
    ]);

    const availableProducts = await getAvailableProducts();

    expect(availableProducts).toHaveLength(2);
    expect(availableProducts.some((p) => p.slug === "monitor-1")).toBe(false);
  });

  it("discontinue - sets inStock to false and returns the updated product", async () => {
    await Product.create({ name: "Headphones", slug: "headphones-1", price: 80 });

    const updatedProduct = await discontinue("headphones-1");

    expect(updatedProduct.inStock).toBe(false);

    const dbProduct = await Product.findOne({ slug: "headphones-1" });
    expect(dbProduct.inStock).toBe(false);
  });

  it('discontinue - throws "Product not found" for an unknown slug', async () => {
    await expect(discontinue("does-not-exist")).rejects.toThrow("Product not found");
  });
});
