"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { IconPackage, IconCheck } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";

const DeliveryBoyDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    assignedOrders: 0,
    deliveredOrders: 0,
    distanceCovered: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch("/api/delivery-boys/dashboard");
      const data = await res.json();
      setStats(data);
      setWeeklyData(data.weeklyDeliveries || []);
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold text-center uppercase">
        Delivery Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300 mt-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconPackage className="h-8 w-8" />
          </div>
          <div className="stat-title">Assigned Orders</div>
          <div className="stat-value text-primary">{stats.assignedOrders}</div>
          <div className="stat-desc">Pending delivery</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconCheck className="h-8 w-8" />
          </div>
          <div className="stat-title">Delivered Orders</div>
          <div className="stat-value text-secondary">
            {stats.deliveredOrders}
          </div>
          <div className="stat-desc">Up-to-date</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profileImage} />
              </div>
            </div>
          </div>
          <div className="stat-title">Distance Covered</div>
          <div className="stat-value text-accent">
            {stats.distanceCovered} km
          </div>
          <div className="stat-desc">Total delivery distance</div>
        </div>
      </div>

      <div className="bg-base-200 p-4 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Weekly Delivery Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="deliveries"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;
