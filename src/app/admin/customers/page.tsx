"use client";
import { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ObjectId } from "mongoose";
import { IconTrash } from "@tabler/icons-react";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: ObjectId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = axios.delete(`/api/users/delete?id=${userId}`);
      toast.promise(res, {
        loading: "Deleting user...",
        success: () => {
          fetchUsers();
          return "User deleted successfully";
        },
        error: "Error deleting user",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-center mb-6">
        Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full table-zebra bg-base-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-base-content hover:bg-base-300 transition"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={user.profileImage} alt={user.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-primary hover:underline"
                    >
                      {user.email}
                    </a>
                    <div className="text-xs text-base-content/50">
                      {user.address}
                    </div>
                  </td>
                  <td className="py-3 px-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        handleDelete(user._id as unknown as ObjectId)
                      }
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
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserPage;
