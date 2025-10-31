import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * Create order from client payload:
 * { items: [{ productId, qty }], shipTo?: string }
 */
export async function createOrder(req, res) {
  const { items = [], shipTo } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "No items" });

  // Load product details & compute total
  const ids = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = Object.fromEntries(products.map(p => [String(p._id), p]));
  const orderItems = items.map(i => {
    const p = byId[i.productId];
    if (!p) throw new Error(`Product not found: ${i.productId}`);
    const qty = Math.max(1, Number(i.qty || 1));
    return { product: p._id, title: p.title, img: p.img, price: p.price, qty };
  });
  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  const user = await User.findById(req.user.id);
  const order = await Order.create({
    user: user._id,
    items: orderItems,
    total,
    status: "PLACED",
    shipTo: shipTo || user.address || ""
  });

  res.status(201).json(order);
}

export async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
}
