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
              <th>Precription</th>
              <th>Drop Address</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Assign Delivery</th>
              <th>Action</th>
              <th>Date</th>
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
                <td>
                  {order.prescriptionId ? (
                    <a
                      href={String(order.prescriptionId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary underline"
                    >
                      View Prescription
                    </a>
                  ) : (
                    "No Prescription"
                  )}
                </td>
                <td>
                  {order.user?.address}
                  <br />
                  <a
                    className="text-sm text-primary font-semibold"
                    target="_blank"
                    href={`https://www.google.com/maps/search/?api=1&query=${order.dropLocation.coordinates[1]},${order.dropLocation.coordinates[0]}`}
                  >
                    View on Map
                  </a>
                </td>
                <td>₹ {String(order.totalAmount)}</td>
                <td>
                  {order.paymentMethod} - {order.paymentStatus}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.deliveryBoy !== null ||
                  order.status === "Cancelled" ? (
                    <span
                      className={` ${
                        order.status !== "Cancelled"
                          ? "text-success"
                          : "text-error"
                      } font-semibold`}
                    >
                      {order?.deliveryBoy?.name}
                      {order.status === "Cancelled" && "Cancelled"}
                    </span>
                  ) : (
                    <select
                      className="select select-sm select-bordered"
                      defaultValue=""
                      onChange={(e) =>
                        assignDeliveryBoy(order._id!, e.target.value)
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
                <td>
                  {order.status !== "Cancelled" ? (
                    <button
                      className="btn btn-sm btn-error"
                      onClick={async () => {
                        const res = axios.get(
                          `/api/order/update-status?id=${order._id}&status=Cancelled`
                        );
                        toast.promise(res, {
                          loading: "Cancelling order...",
                          success: "Order cancelled!",
                          error: "Failed to cancel order",
                        });
                        location.reload();
                      }}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-disabled">
                      Cancelled
                    </button>
                  )}
                </td>
                <td>{new Date(order.createdAt!).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StoreOrdersPage;
