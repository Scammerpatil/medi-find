import mongoose, { Schema } from "mongoose";

const MedicineModel = new Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalStore",
    },
    name: String,
    description: String,
    price: Number,
    stock: Number,
    prescriptionRequired: { type: Boolean, default: false },
    imageUrl: String,
  },
  { timestamps: true }
);

const Medicine =
  mongoose.models.Medicine || mongoose.model("Medicine", MedicineModel);
export default Medicine;
