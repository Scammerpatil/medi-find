import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await User.find({}).sort({ createdAt: -1 });
  return NextResponse.json(users, { status: 200 });
}
