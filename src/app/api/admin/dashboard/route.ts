import DeliveryBoy from "@/models/DeliveryBoy";
import MedicalStore from "@/models/MedicalStore";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const users = await User.countDocuments({});
  const stores = await MedicalStore.countDocuments({});
  const deliveryBoys = await DeliveryBoy.countDocuments({});
  const orders = await Order.countDocuments({});

  const orderStats = await Order.aggregate([
    {
      $lookup: {
        from: "medicalstores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      },
    },
    { $unwind: "$store" },
    {
      $group: {
        _id: "$store.city",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        city: "$_id",
        count: 1,
        _id: 0,
      },
    },
    { $sort: { count: -1 } },
  ]);

  return NextResponse.json({
    users,
    stores,
    deliveryBoys,
    orders,
    orderStats,
  });
}
