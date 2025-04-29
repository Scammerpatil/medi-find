import mongoose, { Schema } from "mongoose";

const MedicalStoreSchema = new Schema({
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
  },
  profileImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3686/3686930.png",
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  licenseImage: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

MedicalStoreSchema.index({ coordinates: "2dsphere" });

const MedicalStore =
  mongoose.models.MedicalStore ||
  mongoose.model("MedicalStore", MedicalStoreSchema);
export default MedicalStore;
