"use client";

import { useAuth } from "@/context/AuthProvider";
import { Order } from "@/types/Order";
import axios from "axios";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get("/api/order/user");
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  const payNow = async (order: any) => {
    toast.loading("Processing payment....");
    try {
      const paymentRes = await axios.post("/api/payment", {
        orderId: order._id,
        amount: order.totalAmount,
      });
      toast.dismiss();

      const options = {
        key: "rzp_test_cXJvckaWoN0JQx",
        amount: paymentRes.data.amount,
        currency: "INR",
        name: "MediFind",
        description: "Medicine Order Payment",
        order_id: paymentRes.data.orderId,
        handler: () => {
          toast.success("Payment Successful!");
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.contact,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.log(error);
      toast.dismiss();
      toast.error(error?.response.data.message);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-4 uppercase">
        My Orders
      </h2>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="overflow-x-auto bg-base-300 rounded-lg shadow-md">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Medicines</th>
              <th>Medical Store</th>
              <th>Delivery Boy</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Pay Now</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order, index: number) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>
                  <ul className="list-disc ml-4">
                    {order.medicines.map((med: any, i: number) => (
                      <li key={i}>
                        {med.name} x {med.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.store?.name}</td>
                <td>
                  {order.deliveryBoy ? order.deliveryBoy.name : "Not Assigned"}
                </td>
                <td>₹ {String(order.totalAmount)}</td>
                <td>
                  {order.paymentMethod} - {order.paymentStatus}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.paymentMethod === "COD" &&
                  order.paymentStatus === "Pending" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => payNow(order)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserOrdersPage;
