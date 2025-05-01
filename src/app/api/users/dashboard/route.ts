import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user: any = jwt.verify(token, process.env.JWT_SECRET as string);
  try {
    const totalBookings = await Order.countDocuments({ user: user.id });

    const upcomingBookings = await Order.countDocuments({
      user: user.id,
      createdAt: { $gte: new Date() },
    });

    const ordersByMonth = await Order.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(user.id) },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return NextResponse.json({
      totalBookings,
      upcomingBookings,
      bookingsByMonth: ordersByMonth,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
