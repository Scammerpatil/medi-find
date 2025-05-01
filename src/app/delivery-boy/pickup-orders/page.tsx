"use client";

import { Order } from "@/types/Order";
import { IconLoader2 } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import haversine from "haversine-distance";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";

export default function PickupOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order/deliveryBoy");
      const enrichedOrders = res.data.map((order: Order) => {
        const pickup = {
          lat: order.pickupLocation.coordinates[0],
          lon: order.pickupLocation.coordinates[1],
        };
        const drop = {
          lat: order.dropLocation.coordinates[0],
          lon: order.dropLocation.coordinates[1],
        };
        const distanceMeters = haversine(pickup, drop);
        return { ...order, distance: distanceMeters / 1000 };
      });
      setOrders(enrichedOrders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setUpdating(id);
    try {
      const res = axios.patch(
        `/api/order/update-status?id=${id}&status=${newStatus}`
      );
      toast.promise(res, {
        loading: "Updating delivery status...",
        success: "Status updated successfully",
        error: "Failed to update status",
      });
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getMapLink = (lat: Number, lng: Number) =>
    `https://maps.google.com/?q=${lat},${lng}`;

  const getNextStatusOptions = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case "Processing":
        return ["Dispatched"];
      case "Dispatched":
        return ["Delivered"];
      default:
        return [];
    }
  };

  const payOnCOD = async (orderId: string) => {
    if (!orderId) {
      toast.error("Order Id is missing!!!");
      return;
    }
    try {
      const res = axios.get(`/api/order/cod-payment?id=${orderId}`);
      toast.promise(res, {
        loading: "Updating status...",
        success: () => {
          fetchOrders();
          return "Payment Done!!!";
        },
        error: "Something went wrong!!!",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!!");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <IconLoader2 className="mx-auto h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-center uppercase">
        Pickup Orders
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full rounded-lg bg-base-300">
          <thead>
            <tr className="bg-base-200">
              <th>Order ID</th>
              <th>Medical Store</th>
              <th>User</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Distance (km)</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order._id} className="hover">
                  <td>{order._id}</td>
                  <td>{order.store?.name}</td>
                  <td>{order.user?.name}</td>
                  <td>
                    {order.store?.address}
                    <br />
                    <a
                      href={getMapLink(
                        order.pickupLocation.coordinates[1],
                        order.pickupLocation.coordinates[0]
                      )}
                      target="_blank"
                      className="link link-primary underline"
                    >
                      View Map
                    </a>
                  </td>
                  <td>
                    {order.user?.address}
                    <br />
                    <a
                      href={getMapLink(
                        order.dropLocation.coordinates[1],
                        order.dropLocation.coordinates[0]
                      )}
                      target="_blank"
                      className="link link-primary underline"
                    >
                      View Map
                    </a>
                  </td>
                  <td>{order.distance?.toFixed(2)} KM</td>
                  <td>
                    {order.paymentMethod !== "ONLINE" &&
                    order.paymentStatus !== "Paid" ? (
                      <button
                        className="btn btn-accent"
                        onClick={() => {
                          payOnCOD(order._id as string);
                        }}
                      >
                        Got Paid in Cash
                      </button>
                    ) : (
                      <p className="btn btn-primary">Paid</p>
                    )}
                  </td>
                  <td>
                    {order.status !== "Delivered" &&
                    order.status !== "Cancelled" ? (
                      <select
                        className="select select-bordered"
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) =>
                          updateStatus(
                            order._id!,
                            e.target.value as OrderStatus
                          )
                        }
                      >
                        <option disabled value={order.status}>
                          {order.status}
                        </option>
                        {getNextStatusOptions(order.status).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="btn btn-success cursor-not-allowed">
                        {order.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
