import Medicine from "@/models/Medicine";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  if (!id) {
    return NextResponse.json({ message: "Id is required" }, { status: 400 });
  }
  const { form } = await req.json();
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, form, {
      new: true,
    });
    if (!updatedMedicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Medicine updated successfully", data: updatedMedicine },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
