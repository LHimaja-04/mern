import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    category: { type: String, index: true },
    img: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
