import DeliveryBoy from "@/models/DeliveryBoy";
import { NextResponse } from "next/server";

export async function GET() {
  const deliveryBoys = await DeliveryBoy.find({});
  return NextResponse.json(deliveryBoys, { status: 200 });
}
