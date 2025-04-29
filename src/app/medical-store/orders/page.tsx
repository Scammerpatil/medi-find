"use client";

import { useEffect, useState } from "react";
import haversine from "haversine-distance";
import axios from "axios";
import toast from "react-hot-toast";
import { Order } from "@/types/Order";
import { DeliveryBoy } from "@/types/DeliveryBoy";

const StoreOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ordersRes = await axios.get("/api/order/store");
      const boysRes = await axios.get("/api/delivery-boys");
      setOrders(ordersRes.data.orders);
      setDeliveryBoys(boysRes.data);
    };

    fetchData();
  }, []);

  const assignDeliveryBoy = async (orderId: string, deliveryBoyId: string) => {
    const res = axios.get(
      `/api/order/assign-delivery?orderId=${orderId}&deliveryBoyId=${deliveryBoyId}`
    );
    toast.promise(res, {
      loading: "Assigning delivery boy...",
      success: "Delivery boy assigned!",
      error: "Failed to assign delivery",
    });
    location.reload();
  };

  const getDistance = (pickup: any, drop: any) => {
    const distance = haversine(
      { lat: pickup.coordinates[1], lon: pickup.coordinates[0] },
      { lat: drop.coordinates[1], lon: drop.coordinates[0] }
    );
    return (distance / 1000).toFixed(2);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-4 uppercase">
        Store Orders
      </h2>
      <div className="overflow-x-auto bg-base-300 rounded-lg shadow-md">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Medicines</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Assign Delivery</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id!}>
                <td>{index + 1}</td>
                <td>{order.user?.name}</td>
                <td>
                  <ul className="list-disc ml-4">
                    {order.medicines.map((med: any, idx: number) => (
                      <li key={idx}>
                        {med.name} x {med.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹ {String(order.totalAmount)}</td>
                <td>
                  {order.paymentMethod} - {order.paymentStatus}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.deliveryBoy !== null ? (
                    <span className="text-green-500 font-semibold">
                      {order.deliveryBoy.name}
                    </span>
                  ) : (
                    <select
                      className="select select-sm select-bordered"
                      defaultValue=""
                      onChange={(e) =>
                        assignDeliveryBoy(order._id, e.target.value)
                      }
                    >
                      <option disabled value="">
                        Choose Delivery Boy
                      </option>
                      {deliveryBoys.map((boy: any) => {
                        const roundTripKm =
                          getDistance(
                            order.pickupLocation,
                            order.dropLocation
                          ) * 2;
                        return (
                          <option key={boy._id} value={boy._id}>
                            {boy.name} - {boy.vehicleType} ({roundTripKm} km)
                          </option>
                        );
                      })}
                    </select>
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

export default StoreOrdersPage;
