import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConfig from "@/middlewares/db.config";

import User from "@/models/User";
import MedicalStore from "@/models/MedicalStore";
import DeliveryBoy from "@/models/DeliveryBoy";
dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { formData } = await req.json();

    if (formData.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    if (formData.role === "user") {
      const userExists = await User.findOne({ email: formData.email });
      if (userExists) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const newUser = new User({
        ...formData,
        profileImage:
          formData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3686/3686930.png",
        password: hashedPassword,
      });

      await newUser.save();
      return NextResponse.json(
        { message: "User created successfully", newUser },
        { status: 201 }
      );
    } else if (formData.role === "medical-store") {
      const medicalStoreExist = await MedicalStore.findOne({
        email: formData.email,
      });
      if (medicalStoreExist) {
        return NextResponse.json(
          { message: "Medical Store with this email already exists" },
          { status: 400 }
        );
      }
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const newUser = new MedicalStore({
        ...formData,
        profileImage:
          formData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3686/3686930.png",
        password: hashedPassword,
      });

      await newUser.save();
      return NextResponse.json(
        { message: "Medical Store created successfully", newUser },
        { status: 201 }
      );
    } else if (formData.role === "delivery-boy") {
      const deliveryBoyExist = await DeliveryBoy.findOne({
        email: formData.email,
      });
      if (deliveryBoyExist) {
        return NextResponse.json(
          { message: "Delivery Boy with this email already exists" },
          { status: 400 }
        );
      }
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const newUser = new DeliveryBoy({
        ...formData,
        profileImage:
          formData.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3686/3686930.png",
        password: hashedPassword,
      });
      newUser.save();
      return NextResponse.json(
        { message: "Delivery Boy Created", newUser },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
