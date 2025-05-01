import { DeliveryBoy } from "./DeliveryBoy";
import { MedicalStore } from "./MedicalStore";
import { User } from "./User";

export interface Order {
  _id?: string;
  user: User | null;
  store: MedicalStore | null;
  deliveryBoy: DeliveryBoy | null;
  medicines: {
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  prescriptionId: String;
  totalAmount: Number;
  paymentMethod: "COD" | "ONLINE";
  status: "Pending" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid";
  createdAt?: Date;
  updatedAt?: Date;
  pickupLocation: {
    type: "Point";
    coordinates: [Number, Number];
  };
  dropLocation: {
    type: "Point";
    coordinates: [Number, Number];
  };
}
