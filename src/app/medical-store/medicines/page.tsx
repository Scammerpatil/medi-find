"use client";
import { Medicine } from "@/types/Medicine";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const StoreMedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Medicine>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    const res = await fetch("/api/medicines/store");
    const data = await res.json();
    setMedicines(data);
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill required fields.");
      return;
    }

    if (isEditing && editId) {
      const res = await fetch(`/api/store/medicines/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Medicine updated!");
        setForm({});
        setIsEditing(false);
        setEditId(null);
        fetchMedicines();
      }
    } else {
      const res = axios.post("/api/medicines/add-medicines", { form });
      toast.promise(res, {
        loading: "Adding medicine...",
        success: () => {
          setForm({});
          fetchMedicines();
          return "Medicine added!";
        },
        error: (err) => {
          return `Error: ${
            err.response?.data?.message || "Something went wrong"
          }`;
        },
      });
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setForm(medicine);
    setIsEditing(true);
    setEditId(medicine._id);
    window.scrollY = 0;
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    const res = axios.delete(`/api/medicines/delete?id${id}`);
    toast.promise(res, {
      loading: "Deleting medicine...",
      success: () => {
        fetchMedicines();
        return "Medicine deleted!";
      },
      error: (err) => {
        return `Error: ${
          err.response?.data?.message || "Something went wrong"
        }`;
      },
    });
  };

  const medicineImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!form.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file,
        name: imageName,
        folderName: folderName,
      });
      console.log(imageResponse);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setForm({
            ...form,
            [path]: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">
        {isEditing ? "Edit Medicine" : "Add Medicine"}
      </h1>

      {/* Form */}
      <div className="max-w-2xl mx-auto mb-10 shadow-lg p-6 bg-base-200 rounded-lg">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleInputChange}
            placeholder="Medicine Name"
            className="input input-bordered input-primary w-full"
          />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
            className="textarea textarea-bordered textarea-primary w-full"
          />
          <input
            type="number"
            name="price"
            value={form.price || ""}
            onChange={handleInputChange}
            placeholder="Price"
            className="input input-bordered input-primary w-full"
          />
          <input
            type="number"
            name="stock"
            value={form.stock || ""}
            onChange={handleInputChange}
            placeholder="Stock"
            className="input input-bordered input-primary w-full"
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                medicineImageUpload(
                  e,
                  "medicines",
                  form.name || "",
                  "imageUrl"
                );
              }
            }}
            className="file file-input file-input-primary w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="prescriptionRequired"
              checked={form.prescriptionRequired || false}
              onChange={handleInputChange}
              className="checkbox checkbox-primary"
            />
            Prescription Required
          </label>
          <button
            onClick={handleSubmit}
            className="btn btn-secondary w-full"
            disabled={loading || !form.name || !form.price || !form.stock}
          >
            {isEditing ? "Update Medicine" : "Add Medicine"}
          </button>
        </div>
      </div>

      {/* Medicines List */}
      <h2 className="text-2xl font-bold mb-4 text-center uppercase">
        Your Medicines
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : medicines.length === 0 ? (
        <p className="text-center text-base-content/50 text-2xl">
          No medicines found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="card bg-base-300 shadow-xl">
              <figure>
                <img
                  src={medicine.imageUrl || "/placeholder.png"}
                  alt={medicine.name}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{medicine.name}</h2>
                <p className="text-sm text-base-content/60">
                  {medicine.description || "No description available."}
                </p>
                <p className="font-bold mt-2">₹{medicine.price} / Per Piece</p>
                <p className="text-sm">
                  Stock: {medicine.stock > 0 ? medicine.stock : "Out of Stock"}
                </p>
                <div className="flex flex-row gap-2 mt-4 items-center">
                  <button
                    className="btn btn-outline btn-primary w-1/2"
                    onClick={() => handleEdit(medicine)}
                  >
                    <IconPencil size={16} /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-error w-1/2"
                    onClick={() => handleDelete(medicine._id)}
                  >
                    <IconTrash size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StoreMedicinesPage;
