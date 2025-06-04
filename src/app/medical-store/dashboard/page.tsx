"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { IconBox, IconShoppingCart } from "@tabler/icons-react";
import { Medicine } from "@/types/Medicine";
import { Order } from "@/types/Order";

const MedicalStoreDashboard = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      fetchMedicines();
      fetchOrders();
    }
  }, [user]);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("/api/medicines/store");
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/order/store");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 uppercase text-center">
        Welcome, {user?.name}
      </h1>

      {/* Medicines Section */}
      <div className="bg-base-300 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2 uppercase mb-8">
          <IconBox size={20} /> Medicines Listed
        </h2>

        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full items-center">
            {medicines.map((medicine) => (
              <Link href={`/medicine?id=${medicine._id}`} key={medicine._id}>
                <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{medicine.name}</h2>
                    <p className="text-base-content/50">
                      {medicine.description}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ₹ {medicine.price.toLocaleString()}
                    </p>
                    <div className="text-xs text-base-content/50 mt-1">
                      Stock: {medicine.stock}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center mx-auto">
            <img
              src="/not-found.png"
              alt="No Medicines"
              className="items-center h-[calc(50vh)]"
            />
            <p className="text-3xl font-semibold uppercase text-base-content">
              No medicines listed yet.
            </p>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center justify-center gap-2 uppercase mb-8">
          <IconShoppingCart size={20} /> Orders Received
        </h2>
        <div className="overflow-x-auto mt-6 bg-base-300">
          <table className="table table-zebra">
            <thead className="bg-base-100 text-base">
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) =>
                  order.medicines.map((med, i) => (
                    <tr key={`${order._id}-${i}`}>
                      {i === 0 && (
                        <>
                          <td rowSpan={order.medicines.length}>{index + 1}</td>
                          <td rowSpan={order.medicines.length}>
                            {order.user?.name}
                          </td>
                        </>
                      )}
                      <td>{med.name}</td>
                      <td>{med.quantity}</td>
                      <td>₹ {med.price.toLocaleString()}</td>
                      {i === 0 && (
                        <>
                          <td rowSpan={order.medicines.length}>
                            ₹ {order.totalAmount.toLocaleString()}
                          </td>
                          <td rowSpan={order.medicines.length}>
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </td>
                          <td
                            rowSpan={order.medicines.length}
                            className="uppercase"
                          >
                            {order.status}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MedicalStoreDashboard;
