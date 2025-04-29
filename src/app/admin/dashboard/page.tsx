"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import {
  IconUser,
  IconBuildingStore,
  IconTruckDelivery,
  IconPackage,
  IconSettings,
} from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#a4de6c",
  "#8dd1e1",
  "#83a6ed",
  "#ffbb28",
  "#ff8042",
  "#d88884",
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    stores: 0,
    deliveryBoys: 0,
    orders: 0,
    feedback: 0,
  });
  const [orderStats, setOrderStats] = useState<
    { city: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      setDashboardData({
        users: data.users,
        stores: data.stores,
        deliveryBoys: data.deliveryBoys,
        orders: data.orders,
        feedback: data.feedback,
      });
      setOrderStats(data.orderStats || []);
    };
    fetchData();
  }, []);

  const pieData = [
    { name: "Users", value: dashboardData.users },
    { name: "Stores", value: dashboardData.stores },
    { name: "Delivery Boys", value: dashboardData.deliveryBoys },
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl uppercase text-center font-bold">
        Admin Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconUser className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{dashboardData.users}</div>
          <div className="stat-desc">Customers registered</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconBuildingStore className="h-8 w-8" />
          </div>
          <div className="stat-title">Medical Stores</div>
          <div className="stat-value text-secondary">
            {dashboardData.stores}
          </div>
          <div className="stat-desc">Stores onboarded</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <IconTruckDelivery className="h-8 w-8" />
          </div>
          <div className="stat-title">Delivery Boys</div>
          <div className="stat-value text-accent">
            {dashboardData.deliveryBoys}
          </div>
          <div className="stat-desc">Active for deliveries</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <IconPackage className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Orders</div>
          <div className="stat-value text-info">{dashboardData.orders}</div>
          <div className="stat-desc">Medicines delivered</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profileImage} alt="admin-avatar" />
              </div>
            </div>
          </div>
          <div className="stat-title">Feedbacks</div>
          <div className="stat-value text-warning">
            {dashboardData.feedback}
          </div>
          <div className="stat-desc">Collected from customers</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-10">
        {/* Order stats per city */}
        <div className="bg-base-200 rounded-xl p-4 shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold text-center mb-4">
            Orders by City
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStats}>
              <XAxis dataKey="city" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User/Store/Delivery Pie Chart */}
        <div className="bg-base-200 rounded-xl p-4 shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold text-center mb-4">
            Platform User Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
