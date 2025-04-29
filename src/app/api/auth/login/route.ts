import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import MedicalStore from "@/models/MedicalStore";
import DeliveryBoy from "@/models/DeliveryBoy";

dbConfig();

const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
};

export async function POST(req: NextRequest) {
  const { formData } = await req.json();

  if (!formData.email || !formData.password) {
    return NextResponse.json(
      { message: "Please fill all the fields", success: false },
      { status: 400 }
    );
  }

  if (
    formData.email === process.env.ADMIN_EMAIL &&
    formData.password === process.env.ADMIN_PASSWORD
  ) {
    const data = {
      id: "admin",
      role: "admin",
      email: process.env.ADMIN_EMAIL,
      name: "Admin",
      profileImage:
        "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-man-user-icon.png",
      isVerified: true,
    };
    const token = generateToken(data);
    const response = NextResponse.json({
      message: "Login Success",
      success: true,
      route: `/admin/dashboard`,
      user: data,
    });
    setTokenCookie(response, token);
    return response;
  }
  if (formData.role === "user") {
    // User login logic
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcryptjs.compare(
      formData.password,
      user.password
    );

    if (isPasswordValid) {
      const data = {
        id: user._id,
        role: "user",
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        isVerified: true,
      };
      const token = generateToken(data);
      const response = NextResponse.json({
        message: "Login Success",
        success: true,
        route: `/user/dashboard`,
        user,
      });
      setTokenCookie(response, token);
      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials", success: false },
        { status: 400 }
      );
    }
  } else if (formData.role === "medical-store") {
    // Medical store login logic
    const medicalStore = await MedicalStore.findOne({
      email: formData.email,
    });
    if (!medicalStore) {
      return NextResponse.json(
        { message: "Medical Store not found", success: false },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcryptjs.compare(
      formData.password,
      medicalStore.password
    );
    if (isPasswordValid) {
      const data = {
        id: medicalStore._id,
        role: "medical-store",
        email: medicalStore.email,
        name: medicalStore.name,
        profileImage: medicalStore.profileImage,
        isVerified: medicalStore.isVerified,
      };
      const token = generateToken(data);
      const response = NextResponse.json({
        message: "Login Success",
        success: true,
        route: `/medical-store/dashboard`,
        user: data,
      });
      setTokenCookie(response, token);
      return response;
    }
  } else if (formData.role === "delivery-boy") {
    const deliveryBoy = await DeliveryBoy.findOne({
      email: formData.email,
    });
    if (!deliveryBoy) {
      return NextResponse.json(
        { message: "Delivery Boy Not Found" },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcryptjs.compare(
      formData.password,
      deliveryBoy.password
    );
    if (isPasswordValid) {
      const data = {
        id: deliveryBoy._id,
        role: "delivery-boy",
        email: deliveryBoy.email,
        name: deliveryBoy.name,
        profileImage: deliveryBoy.profileImage,
        isVerified: true,
      };
      const token = generateToken(data);
      const response = NextResponse.json({
        message: "Login Success",
        success: true,
        route: "/delivery-boy/dashboard",
        user: data,
      });
      setTokenCookie(response, token);
      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials", success: false },
        { status: 400 }
      );
    }
  }
  return NextResponse.json(
    { message: "Invalid Credentials", success: false },
    { status: 400 }
  );
}
