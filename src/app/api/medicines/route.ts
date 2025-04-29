import dbConfig from "@/middlewares/db.config";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

dbConfig();

export async function GET() {
  const medicines = await Medicine.find({})
    .sort({ createdAt: -1 })
    .populate("store");
  return NextResponse.json(medicines, { status: 200 });
}
