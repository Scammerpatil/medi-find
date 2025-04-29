import MedicalStore from "@/models/MedicalStore";
import { NextResponse } from "next/server";

export async function GET() {
  const medicalStores = await MedicalStore.find({});
  return NextResponse.json(medicalStores, { status: 200 });
}
