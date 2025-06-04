import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    let name = formData.get("name") as string;
    const folderName = formData.get("folderName") as string;

    if (!(file instanceof Blob) || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid file or filename" },
        { status: 400 }
      );
    }

    name = name.split(" ").join("_");

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      public_id: name,
      folder: folderName,
      resource_type: "image",
    });
    return NextResponse.json({
      success: true,
      path: uploadResponse.secure_url,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed." },
      { status: 500 }
    );
  }
}
