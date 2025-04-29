"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setUser } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await axios.get("/api/auth/verifytoken");
    if (res.data) {
      setUser(res.data.data);
    }
  };
  return (
    <html lang="en" data-theme="forest">
      <head>
        <title>
          MediFind — Fast. Trusted. Decentralized Medicine at Your Doorstep.
        </title>
        <meta
          name="description"
          content="Order medicines online with MediFind, a decentralized medicine delivery platform. Find nearby pharmacies, upload prescriptions, and get fast home delivery. Trusted, multilingual, and secure."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
