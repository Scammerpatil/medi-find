import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "@/models/Order";
import Medicine from "@/models/Medicine";
import User from "@/models/User";
import MedicalStore from "@/models/MedicalStore";
import { Types } from "mongoose";
import dbConfig from "@/middlewares/db.config";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { medicines, prescriptionId, paymentMethod, totalAmount } =
      await req.json();
    const token = req.cookies.get("token")?.value as string;
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const dbUser = await User.findById(user.id);
    if (!dbUser || !dbUser.coordinates) {
      return NextResponse.json(
        { message: "User location not found." },
        { status: 400 }
      );
    }
    if (paymentMethod === "cod") {
      const storeWiseMap = new Map<string, any[]>();

      for (const item of medicines) {
        const med = await Medicine.findById(item.medicineId);
        if (!med) continue;

        const storeId = med.store.toString();
        if (!storeWiseMap.has(storeId)) {
          storeWiseMap.set(storeId, []);
        }

        (storeWiseMap.get(storeId) ?? []).push({
          medicine: med,
          quantity: item.quantity,
        });
      }

      const orderResults = [];

      for (const [storeId, items] of storeWiseMap) {
        const store = await MedicalStore.findById(storeId);
        if (!store || !store.coordinates) continue;

        const medicines = items.map(({ medicine, quantity }) => ({
          name: medicine.name,
          quantity,
          price: medicine.price,
        }));

        const totalAmount = medicines.reduce(
          (sum, med) => sum + med.price * med.quantity,
          0
        );

        for (const { medicine, quantity } of items) {
          medicine.stock -= quantity;
          await medicine.save();
        }

        const newOrder = await Order.create({
          user: user.id,
          store: new Types.ObjectId(storeId),
          deliveryBoy: null,
          medicines,
          prescriptionId: prescriptionId || null,
          totalAmount,
          paymentMethod: paymentMethod || "COD",
          pickupLocation: store.coordinates,
          dropLocation: dbUser.coordinates,
        });

        orderResults.push(newOrder);
      }

      return NextResponse.json({ success: true, orders: orderResults });
    } else if (paymentMethod === "ONLINE") {
      const storeWiseMap = new Map<string, any[]>();

      for (const item of medicines) {
        const med = await Medicine.findById(item.medicineId);
        if (!med) continue;

        const storeId = med.store.toString();
        if (!storeWiseMap.has(storeId)) {
          storeWiseMap.set(storeId, []);
        }

        (storeWiseMap.get(storeId) ?? []).push({
          medicine: med,
          quantity: item.quantity,
        });
      }

      const orderResults = [];

      for (const [storeId, items] of storeWiseMap) {
        const store = await MedicalStore.findById(storeId);
        if (!store || !store.coordinates) continue;

        const medicines = items.map(({ medicine, quantity }) => ({
          name: medicine.name,
          quantity,
          price: medicine.price,
        }));

        const totalAmount = medicines.reduce(
          (sum, med) => sum + med.price * med.quantity,
          0
        );

        for (const { medicine, quantity } of items) {
          medicine.stock -= quantity;
          await medicine.save();
        }

        const newOrder = await Order.create({
          user: user.id,
          store: new Types.ObjectId(storeId),
          deliveryBoy: null,
          medicines,
          prescriptionId: prescriptionId || null,
          totalAmount,
          paymentMethod: paymentMethod || "ONLINE",
          pickupLocation: store.coordinates,
          dropLocation: dbUser.coordinates,
        });

        orderResults.push(newOrder);
      }

      var options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `rcp_${Date.now()}`,
      };
      const paymentOrder = await razorpay.orders.create(options);
      if (!paymentOrder) {
        return NextResponse.json(
          { message: "Order creation failed!" },
          { status: 500 }
        );
      }
      orderResults.forEach((order) => {
        order.transactionId = paymentOrder.id;
        order.paymentStatus = "Paid";
        order.save();
      });

      return NextResponse.json({
        orders: orderResults,
        orderId: paymentOrder.id,
        amount: paymentOrder.amount,
      });
    }
  } catch (error) {
    console.error("Order placement error:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
