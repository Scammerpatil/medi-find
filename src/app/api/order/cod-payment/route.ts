import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Order Id is required!!!" },
      { status: 400 }
    );
  }
  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found!!!" },
        { status: 404 }
      );
    }
    order.paymentStatus = "Paid";
    order.save();
    return NextResponse.json(
      { message: "Payment Status updated" },
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
