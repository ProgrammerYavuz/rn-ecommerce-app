import express from "express"
import { protect } from "../middleware/auth.js"
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressController.js"

const AddressRouter = express.Router()

// Get user addresses
AddressRouter.get("/", protect, getAddresses)

// Add new addresses
AddressRouter.post("/", protect, addAddress)

// Update address
AddressRouter.put("/:id", protect, updateAddress)

// Delete address
AddressRouter.delete("/:id", protect, deleteAddress)

export default AddressRouter