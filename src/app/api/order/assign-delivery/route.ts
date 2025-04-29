import DeliveryBoy from "@/models/DeliveryBoy";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const deliveryBoyId = searchParams.get("deliveryBoyId");
  if (!orderId || !deliveryBoyId) {
    return NextResponse.json(
      { message: "Missing orderId or deliveryBoyId" },
      { status: 400 }
    );
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return NextResponse.json(
        { message: "Delivery Boy Not found" },
        { status: 404 }
      );
    }
    if (order.status !== "Pending") {
      return NextResponse.json(
        { message: "Order is not in pending state" },
        { status: 400 }
      );
    }
    order.deliveryBoy = deliveryBoyId;
    order.status = "Processing";
    order.save();
    return NextResponse.json(
      { message: "Delivery Boy Assigned" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
