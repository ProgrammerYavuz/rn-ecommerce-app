import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types/index.js";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, trim: true, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["Erkek", "Kadın", "Çocuk", "Ayakkabı", "Çanta", "Diğer"],
      default: "Diğer",
    },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;