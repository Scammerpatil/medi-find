import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/middlewares/db.config";
import Order from "@/models/Order";

dbConfig();
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value as string;
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  try {
    const orders = await Order.find({ user: decoded.id })
      .populate("user")
      .populate("store")
      .populate("deliveryBoy");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!!" },
      { status: 500 }
    );
  }
}
