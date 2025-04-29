import DeliveryBoy from "@/models/DeliveryBoy";
import MedicalStore from "@/models/MedicalStore";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
// users: data.users,
// stores: data.stores,
// deliveryBoys: data.deliveryBoys,
// orders: data.orders,
// feedback: data.feedback,
export async function GET(req: NextRequest) {
  const users = await User.countDocuments({});
  const stores = await MedicalStore.countDocuments({});
  const deliveryBoys = await DeliveryBoy.countDocuments({});
  const orders = await Order.countDocuments({});
  const feedback = await Order.countDocuments({ feedback: { $ne: null } });

  return NextResponse.json({
    users,
    stores,
    deliveryBoys,
    orders,
    feedback,
  });
}
