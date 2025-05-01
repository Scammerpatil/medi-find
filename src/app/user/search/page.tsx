"use client";
import { useCart } from "@/context/CartContext";
import { Medicine } from "@/types/Medicine";
import haversine from "haversine-distance";
import { IconAlertSquareRoundedFilled, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 6;

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await fetch("/api/medicines");
      const data = await res.json();
      setMedicines(data);
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoordinates({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const keyword = search.toLowerCase();
    return (
      med.name.toLowerCase().includes(keyword) ||
      med.description.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    (document.getElementById("main-content") as HTMLElement).scrollTop = 0;
  };

  const getDistance = (pickup: any, coordinates: any) => {
    const distance = haversine(
      { lat: pickup.coordinates[1], lon: pickup.coordinates[0] },
      { lat: coordinates.lat, lon: coordinates.lng }
    );
    return (distance / 1000).toFixed(2);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center uppercase mb-6">
        Search Medicines
      </h1>

      <div className="max-w-xl mx-auto mb-6">
        <label className="input input-primary input-bordered w-full">
          <IconSearch className="h-[1em] opacity-50" />
          <input
            type="search"
            placeholder="Search for medicine..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </label>
        <input />
        <div role="alert" className="alert alert-info">
          <IconAlertSquareRoundedFilled size={16} />
          <span>
            <strong>Note:</strong> Each "piece" refers to a single tablet. For
            example, ordering <strong>1 piece</strong> means you will receive{" "}
            <strong>1 tablet</strong>.
            <br />
            If you wish to purchase an entire strip (which typically contains 15
            tablets), please enter <strong>15 pieces</strong> when placing your
            order.
            <br />
            Always ensure you specify the exact quantity of tablets required to
            avoid confusion.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="ml-4">Loading...</p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center h-full flex flex-col items-center justify-center mx-auto">
          <img
            src="/not-found.png"
            alt="No Medicines"
            className="items-center h-[calc(50vh)]"
          />
          <p className="text-3xl font-semibold uppercase text-base-content">
            No medicines listed yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMedicines.map((medicine) => (
              <div
                key={medicine._id}
                className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
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

                  <div className="mt-2 space-y-1">
                    <p className="font-bold text-lg text-primary">
                      ₹{medicine.price} / Per Piece
                    </p>

                    <div className="flex gap-2 flex-wrap mt-2">
                      {medicine.prescriptionRequired ? (
                        <span className="badge badge-error">
                          Prescription Required
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          No Prescription
                        </span>
                      )}
                      {medicine.stock > 0 ? (
                        <>
                          <span className="badge badge-info">
                            In Stock: {medicine.stock} / Pieces
                          </span>
                          <span
                            className={`badge ${
                              medicine.stock < 10
                                ? "badge-error"
                                : "badge-success"
                            } `}
                          >
                            {medicine.stock > 10 ? "In Stock" : "Low Stock"}
                          </span>
                        </>
                      ) : (
                        <span className="badge badge-outline badge-error">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-base-content/40 mt-1 italic">
                      From: {medicine.store.name || "Unknown Store"} -{" "}
                      {getDistance(medicine.store.coordinates, coordinates)} km
                    </p>

                    <button
                      disabled={medicine.stock === 0}
                      onClick={() => addToCart(medicine)}
                      className="btn btn-primary btn-sm w-full mt-3"
                    >
                      {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline btn-primary"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MedicinesPage;
