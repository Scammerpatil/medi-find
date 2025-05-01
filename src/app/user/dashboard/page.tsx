"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IconHome, IconCalendar } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";

const UserDashboard = () => {
  const [data, setData] = useState<any>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/users/dashboard");
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  const bookingData = data.bookingsByMonth || [];

  return (
    <>
      <h1 className="text-3xl font-semibold text-center uppercase">
        User Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300 mt-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconHome className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-primary">
            {data.totalBookings || 0}
          </div>
          <div className="stat-desc">Your lifetime bookings</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <IconCalendar className="h-8 w-8" />
          </div>
          <div className="stat-title">Upcoming Bookings</div>
          <div className="stat-value text-accent">
            {data.upcomingBookings || 0}
          </div>
          <div className="stat-desc">Exciting stays ahead!</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src={user?.profileImage || "/default-avatar.png"} />
              </div>
            </div>
          </div>
          <div className="stat-value">{user?.name}</div>
          <div className="stat-title">Logged In</div>
        </div>
      </div>

      <div className="bg-base-200 p-4 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Bookings Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default UserDashboard;
