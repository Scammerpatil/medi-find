"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ObjectId } from "mongoose";
import { IconTrash } from "@tabler/icons-react";
import { DeliveryBoy } from "@/types/DeliveryBoy";

const DeliveryBoyPage = () => {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);

  const fetchDeliveryBoys = async () => {
    try {
      const response = await axios.get("/api/delivery-boys");
      setDeliveryBoys(response.data);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleDelete = async (deliveryBoyId: ObjectId) => {
    if (!confirm("Are you sure you want to delete this delivery boy?")) return;

    try {
      const res = axios.delete(`/api/delivery-boys/delete?id=${deliveryBoyId}`);
      toast.promise(res, {
        loading: "Deleting delivery boy...",
        success: () => {
          fetchDeliveryBoys();
          return "Delivery boy deleted successfully";
        },
        error: "Error deleting delivery boy",
      });
    } catch (error) {
      console.error("Error deleting delivery boy:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-center mb-6">
        Manage Delivery Boys
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full table-zebra bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Contact</th>
              <th className="py-3 px-6 text-left">Vehicle</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.length > 0 ? (
              deliveryBoys.map((boy, index) => (
                <tr
                  key={index}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={boy.profileImage} alt={boy.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{boy.name}</div>
                        <div className="text-sm text-base-content/50">
                          {boy.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="font-semibold">{boy.contact}</div>
                    <div className="text-xs text-base-content/50">
                      {boy.address}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="capitalize">{boy.vehicleType}</div>
                    <div className="text-xs text-base-content/50">
                      {boy.vehicleNumber}
                    </div>
                  </td>
                  <td className="py-3 px-6 capitalize">{boy.status}</td>
                  <td className="py-3 px-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(boy._id)}
                      className="btn btn-error transition"
                    >
                      <IconTrash size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center py-6 text-base-content/50">
                <td colSpan={6} className="py-6">
                  No delivery boys found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeliveryBoyPage;
