import Product from "../models/Product.js";

export async function listProducts(req, res) {
  const { q = "", category, sort = "featured", limit = 50 } = req.query;
  const filter = {};
  if (q) filter.$or = [{ title: { $regex: q, $options: "i" } }, { desc: { $regex: q, $options: "i" } }];
  if (category && category !== "All") filter.category = category;

  const cursor = Product.find(filter);

  switch (sort) {
    case "price-asc": cursor.sort({ price: 1 }); break;
    case "price-desc": cursor.sort({ price: -1 }); break;
    case "rating-desc": cursor.sort({ rating: -1 }); break;
    case "title-asc": cursor.sort({ title: 1 }); break;
    default: cursor.sort({ createdAt: -1 }); // featured = new first
  }

  const items = await cursor.limit(Math.min(Number(limit) || 50, 200));
  res.json(items);
}

export async function getProduct(req, res) {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
}
