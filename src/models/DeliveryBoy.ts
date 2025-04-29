import { profile } from "console";
import mongoose, { Schema } from "mongoose";

const DeliveryBoySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
  },
  vehicleType: {
    type: String,
    enum: ["bike", "car", "scooter"],
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "available",
  },
  password: {
    type: String,
    required: true,
  },
});

const DeliveryBoy =
  mongoose.models.DeliveryBoy ||
  mongoose.model("DeliveryBoy", DeliveryBoySchema);
export default DeliveryBoy;
