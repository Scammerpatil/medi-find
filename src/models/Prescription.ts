import mongoose, { Schema } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: String,
    isPrescriptionOnly: Boolean,
    extractedMedicines: [String],
    verifiedByStore: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);

export default Prescription;
