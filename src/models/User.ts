import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
});

UserSchema.index({ coordinates: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
