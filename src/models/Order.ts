import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalStore",
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
    },
    medicines: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    prescriptionId: {
      type: String,
    },
    totalAmount: Number,
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    transactionId: {
      type: String,
    },
    pickupLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    dropLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ pickupLocation: "2dsphere" });
OrderSchema.index({ dropLocation: "2dsphere" });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
