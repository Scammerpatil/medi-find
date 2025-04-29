import dbConfig from "@/middlewares/db.config";
import DeliveryBoy from "@/models/DeliveryBoy";
import MedicalStore from "@/models/MedicalStore";
import User from "@/models/User";
import { User as UserType } from "@/types/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    if (data.role === "admin") {
      return NextResponse.json({ data, status: 200 });
    } else if (data.role === "user") {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" });
      }
      return NextResponse.json({ data, status: 200 });
    } else if (data.role === "medical-store") {
      const medicalStore = await MedicalStore.find({ email: data.email });
      if (!medicalStore) {
        return NextResponse.json({ error: "Medical Store not found" });
      }
      return NextResponse.json({ data, status: 200 });
    } else if (data.role === "delivery-boy") {
      const deliveryBoy = await DeliveryBoy.findOne({ email: data.email });
      if (!deliveryBoy) {
        return NextResponse.json({ error: "Delivery Boy not found" });
      }
      return NextResponse.json({ data, status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid role" });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
