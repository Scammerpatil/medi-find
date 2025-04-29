import dbConfig from "@/middlewares/db.config";
import MedicalStore from "@/models/MedicalStore";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  if (!id || !String(status)) {
    return NextResponse.json(
      { message: "Store ID and Status is needed" },
      { status: 500 }
    );
  }
  try {
    const updateStore = await MedicalStore.findByIdAndUpdate(
      id,
      { isVerified: status },
      { new: true }
    );
    if (!updateStore) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Store status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!!!" },
      { status: 500 }
    );
  }
}
