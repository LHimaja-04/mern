import User from "../models/User.js";

export async function getWishlist(req, res) {
  const user = await User.findById(req.user.id).populate("wishlist.product");
  res.json(user.wishlist || []);
}

export async function addToWishlist(req, res) {
  const { productId } = req.body || {};
  if (!productId) return res.status(400).json({ message: "productId required" });

  const user = await User.findById(req.user.id);
  const exists = user.wishlist.some(w => String(w.product) === String(productId));
  if (!exists) user.wishlist.unshift({ product: productId });
  await user.save();
  await user.populate("wishlist.product");
  res.status(201).json(user.wishlist);
}

export async function removeFromWishlist(req, res) {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter(w => String(w.product) !== String(productId));
  await user.save();
  await user.populate("wishlist.product");
  res.json(user.wishlist);
}
