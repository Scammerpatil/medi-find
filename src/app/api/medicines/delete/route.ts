import Medicine from "@/models/Medicine";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Id is required!" }, { status: 400 });
  }
  try {
    const deleteMedicine = await Medicine.findByIdAndDelete(id);
    if (!deleteMedicine) {
      return NextResponse.json(
        { message: "Medicine not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Medicine deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
