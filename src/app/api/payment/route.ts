import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  const { orderId, amount } = await req.json();
  console.log(orderId, amount);
  if (!orderId || !amount) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    const order = await Order.findById(orderId);
    var options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcp_${Date.now()}`,
    };
    const paymentOrder = await razorpay.orders.create(options);
    console.log(paymentOrder);
    if (!paymentOrder) {
      return NextResponse.json(
        { message: "Order creation failed!" },
        { status: 500 }
      );
    }
    order.transactionId = order.id;
    order.paymentStatus = "Paid";
    order.save();
    return NextResponse.json(
      {
        message: "Payment successful",
        orderId: order.id,
        amount: order.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to proceed to payment" },
      { status: 500 }
    );
  }
}
