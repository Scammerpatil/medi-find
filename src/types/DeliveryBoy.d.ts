export interface DeliveryBoy {
  _id: ObjectId;
  name: string;
  email: string;
  contact: string;
  profileImage: string;
  vehicleType: "bike" | "car" | "scooter";
  vehicleNumber: string;
  address: string;
  status: "available" | "busy" | "offline";
}
