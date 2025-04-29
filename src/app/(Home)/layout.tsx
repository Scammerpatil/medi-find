import { Toaster } from "react-hot-toast";
import "../globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>
          MediFind — Fast. Trusted. Decentralized Medicine at Your Doorstep.
        </title>
        <meta
          name="description"
          content="Order medicines online with MediFind, a decentralized medicine delivery platform. Find nearby pharmacies, upload prescriptions, and get fast home delivery. Trusted, multilingual, and secure."
        />
      </head>
      <body className="antialiased">
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
