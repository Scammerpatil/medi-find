import { IconCircleChevronRight } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-base-300 h-[calc(100vh-5.6rem)] flex items-center">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              MediFind — Fast. Trusted. Decentralized Medicine at Your Doorstep.
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              MediFind is a decentralized, next-gen medicine delivery platform
              that connects users with nearby verified medical stores for fast
              and secure access to medications. Whether you're ordering
              over-the-counter products or uploading prescriptions, MediFind
              ensures transparency, reliability, and convenience. Users can
              search for medicines in their preferred language (Hindi or
              English), upload prescriptions for validation, and choose between
              online payment or cash on delivery.
            </p>
            <a
              href="/login"
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Get Started
              <IconCircleChevronRight />
            </a>
            <a
              href="/about"
              className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
            >
              Learn More
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/bg.png" alt="Hero Icon" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-16 bg-base-100 text-base-content" id="about">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">About MediFind</h2>
          <p className="text-lg text-base-content/70">
            MediFind is an innovative decentralized platform built to simplify
            medicine discovery and delivery. We empower users by connecting them
            to local pharmacies, ensuring quick access to necessary medications—
            even for prescription-only drugs. Our goal is to make medication
            affordable, accessible, and delivered with speed and safety.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-base-200 text-base-content" id="features">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Nearby Medical Stores
              </h3>
              <p className="text-base-content/70">
                Find and connect with verified pharmacies closest to your
                location.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Prescription Upload & Validation
              </h3>
              <p className="text-base-content/70">
                Upload prescriptions for automatic medicine extraction and store
                availability checks.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Multi-language Support
              </h3>
              <p className="text-base-content/70">
                Choose between Hindi and English for a seamless user experience.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Real-time Order Tracking
              </h3>
              <p className="text-base-content/70">
                Track your orders from pharmacy pickup to doorstep delivery.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Online/COD Payments
              </h3>
              <p className="text-base-content/70">
                Flexible payment options including Razorpay integration or Cash
                on Delivery.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-base-100 shadow-xl">
              <h3 className="font-semibold text-xl mb-2">
                Verified Pharmacies Only
              </h3>
              <p className="text-base-content/70">
                Admin-reviewed medical stores ensure authenticity and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-16 bg-base-100 text-base-content" id="contact">
        <div className="max-w-screen-md mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="mb-6 text-base-content/70">
            Have questions, suggestions, or need help? Reach out to our support
            team and we’ll get back to you as soon as possible.
          </p>
          <a
            href="mailto:support@medifind.com"
            className="btn btn-primary text-lg rounded-lg"
          >
            Email Us
          </a>
        </div>
      </section>
    </>
  );
}
