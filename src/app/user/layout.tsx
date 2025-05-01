"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

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
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };
    const res = await axios.get("/api/auth/verifytoken");
    if (res.data) {
      setUser(res.data.data);
    }
  };
  return (
    <html lang="en" data-theme="forest">
      <head>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></Script>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.26tY-h6gH9w.L.W.O/am=CAM/d=0/rs=AN8SPfpIXxhebB2A47D9J-MACsXmFF6Vew/m=el_main_css"
        />
        <title>
          MediFind — Fast. Trusted. Decentralized Medicine at Your Doorstep.
        </title>
        <meta
          name="description"
          content="Order medicines online with MediFind, a decentralized medicine delivery platform. Find nearby pharmacies, upload prescriptions, and get fast home delivery. Trusted, multilingual, and secure."
        />
      </head>
      <body className={`antialiased`}>
        <div
          id="google_translate_element"
          className="fixed right-60 top-[5px] z-50 py-2 rounded-lg bg-base-300 text-base-content h-14 overflow-hidden"
        ></div>
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
      <CartProvider>
        <Component>{children}</Component>
      </CartProvider>
    </AuthProvider>
  );
}
