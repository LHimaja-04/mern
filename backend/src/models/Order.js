import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: String,
    img: String,
    price: Number,
    qty: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ["PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"], default: "PLACED" },
    shipTo: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
