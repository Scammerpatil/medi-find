import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  if (!id || !status) {
    return NextResponse.json(
      { message: "Order id and status is required" },
      { status: 400 }
    );
  }
  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }
    order.status = status;
    order.save();
    return NextResponse.json(
      { message: "Order Status Updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Oops!! Something went wrong!!" },
      { status: 500 }
    );
  }
}
