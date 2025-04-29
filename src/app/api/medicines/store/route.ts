import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Medicine from "@/models/Medicine";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const medicines = await Medicine.find({ store: decoded.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(medicines, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
