import dbConfig from "@/middlewares/db.config";
import DeliveryBoy from "@/models/DeliveryBoy";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import haversine from "haversine-distance";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const deliveryBoy = await DeliveryBoy.findById(decoded.id);
    if (!deliveryBoy) {
      return NextResponse.json(
        { message: "Delivery boy not found" },
        { status: 404 }
      );
    }
    const getDayName = (date: Date) =>
      date.toLocaleDateString("en-US", { weekday: "long" });

    const deliveryCounts: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyDeliveries = await Order.find({
      deliveryBoy: deliveryBoy._id,
      status: "Delivered",
      updatedAt: { $gte: oneWeekAgo },
    });
    weeklyDeliveries.forEach((order) => {
      const day = getDayName(new Date(order.updatedAt));
      deliveryCounts[day] += 1;
    });

    const formattedWeeklyData = Object.entries(deliveryCounts).map(
      ([day, deliveries]) => ({ day, deliveries })
    );
    const assignedOrders = await Order.find({ deliveryBoy: deliveryBoy._id });
    const deliveredOrders = await Order.find({
      deliveryBoy: deliveryBoy._id,
      status: "Delivered",
    });

    let distanceCovered = 0;

    for (const order of deliveredOrders) {
      const pickup = {
        lat: order.pickupLocation.coordinates[0],
        lon: order.pickupLocation.coordinates[1],
      };
      const drop = {
        lat: order.dropLocation.coordinates[0],
        lon: order.dropLocation.coordinates[1],
      };
      distanceCovered += haversine(pickup, drop);
    }
    return NextResponse.json({
      assignedOrders: assignedOrders.length,
      deliveredOrders: deliveredOrders.length,
      distanceCovered: distanceCovered / 1000,
      weeklyDeliveries: formattedWeeklyData,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
