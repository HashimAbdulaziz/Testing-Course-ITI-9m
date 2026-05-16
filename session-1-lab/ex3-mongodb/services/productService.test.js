const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/Product");
const {
  createProduct,
  getAvailableProducts,
  discontinue,
} = require("./productService");

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
  it("createProduct creates a product with the right name, slug, and defaults inStock to true", async () => {
    const data = { name: "Mechanical Keyboard", slug: "mech-kb", price: 120 };
    const product = await createProduct(data);

    expect(product.name).toBe("Mechanical Keyboard");
    expect(product.slug).toBe("mech-kb");
    expect(product.price).toBe(120);
    expect(product.inStock).toBe(true);
  });

  it("createProduct throws Slug already in use when the slug is taken", async () => {
    const data = { name: "Laptop", slug: "macbook", price: 1000 };
    await createProduct(data);

    await expect(createProduct(data)).rejects.toThrow("Slug already in use");
  });

  it("createProduct rejects a negative price because of the min 0 validation", async () => {
    const invalidProduct = { name: "Freebie", slug: "freebie", price: -5 };

    await expect(createProduct(invalidProduct)).rejects.toThrow(/min/i);
  });

  it("getAvailableProducts only returns products that are in stock", async () => {
    await Product.create([
      { name: "Mouse", slug: "mouse-1", price: 20, inStock: true },
      { name: "Monitor", slug: "monitor-1", price: 300, inStock: false },
      { name: "Desk", slug: "desk-1", price: 150, inStock: true },
    ]);

    const available = await getAvailableProducts();

    expect(available).toHaveLength(2);
    const slugs = available.map((p) => p.slug);
    expect(slugs).toContain("mouse-1");
    expect(slugs).toContain("desk-1");
    expect(slugs).not.toContain("monitor-1");
  });

  it("discontinue sets inStock to false and gives back the updated product", async () => {
    await Product.create({ name: "Headphones", slug: "headphones-1", price: 80 });

    const updated = await discontinue("headphones-1");
    expect(updated.inStock).toBe(false);

    const fromDb = await Product.findOne({ slug: "headphones-1" });
    expect(fromDb.inStock).toBe(false);
  });

  it("discontinue throws Product not found for a slug that doesnt exist", async () => {
    await expect(discontinue("does-not-exist")).rejects.toThrow("Product not found");
  });
});
