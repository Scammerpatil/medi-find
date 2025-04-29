"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ObjectId } from "mongoose";
import { IconCheck, IconCross, IconTrash } from "@tabler/icons-react";
import { MedicalStore } from "@/types/MedicalStore";

const MedicalStorePage = () => {
  const [stores, setStores] = useState<MedicalStore[]>([]);

  const fetchStores = async () => {
    try {
      const response = await axios.get("/api/medical-stores");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching medical stores:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleDelete = async (storeId: ObjectId) => {
    if (!confirm("Are you sure you want to delete this medical store?")) return;

    try {
      const res = axios.delete(`/api/medical-stores/delete?id=${storeId}`);
      toast.promise(res, {
        loading: "Deleting store...",
        success: () => {
          fetchStores();
          return "Medical store deleted successfully";
        },
        error: "Error deleting medical store",
      });
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const handleVerification = async (storeId: ObjectId, status: boolean) => {
    const res = axios.get(
      `/api/medical-stores/approve?id=${storeId}&status=${status}`
    );
    toast.promise(res, {
      loading: "Approving Medical Store...",
      success: () => {
        fetchStores();
        return "Store Approved";
      },
      error: (e) =>
        e.response.data.message || "Something went wrong!! Try again",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-center mb-6">
        Manage Medical Stores
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full table-zebra bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Store Name</th>
              <th className="py-3 px-6 text-left">Email & Contact</th>
              <th className="py-3 px-6 text-left">License</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.length > 0 ? (
              stores.map((store, index) => (
                <tr
                  key={index}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={store.profileImage} alt={store.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{store.name}</div>
                        {store.isVerified ? (
                          <div className="text-sm text-success">Verified</div>
                        ) : (
                          <div className="text-sm text-error">
                            {" "}
                            Not Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <a
                      href={`mailto:${store.email}`}
                      className="text-primary hover:underline block"
                    >
                      {store.email}
                    </a>
                    <span className="text-xs text-base-content/70">
                      📞 {store.contact}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="text-sm">{store.licenseNumber}</div>
                    <a
                      href={store.licenseImage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View License
                    </a>
                  </td>
                  <td className="py-3 px-6">{store.address}</td>
                  <td className="py-3 px-6 flex items-center justify-center gap-2">
                    {store.isVerified ? (
                      <button
                        className="btn btn-secondary transition"
                        onClick={() => {
                          handleVerification(store._id!, false);
                        }}
                      >
                        <IconCross size={16} />
                        Revoke
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary transition"
                        onClick={() => {
                          handleVerification(store._id!, true);
                        }}
                      >
                        <IconCheck size={16} /> Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(store._id!)}
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
                  No medical stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MedicalStorePage;
