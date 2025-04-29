import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Medicine from "@/models/Medicine";

export async function POST(req: NextRequest) {
  const { form } = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const medicine = await Medicine.create({
      ...form,
      store: decoded.id,
    });
    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
