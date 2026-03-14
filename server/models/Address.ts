import mongoose from "mongoose";
import { IAddress } from "../types/index.js";

const AddressSchema = new mongoose.Schema<IAddress>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    type: { type: String, required: true, enum: ["home", "work", "other"], default: "home" },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    phone: {type: String, default: ""},
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAddress>("Address", AddressSchema);
