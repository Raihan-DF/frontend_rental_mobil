"use client";
import KijangInova from "../../../../assets/images/kijang_inova.png";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";

export interface Vehicle {
  id: number;
  name: string;
  year: number;
  typeId: string;
  transmission: string;
  licensePlate: string;
  features: string;
  description: string;
  status: string;
  harga: number;
  type: Type;
  images: Images[];
}

export interface Images {
  id: number;
  imageUrl: string;
}

export interface Type {
  id: number;
  typeName: string;
}

export default function VehiclesGeneral() {
  const [isDriver, setIsDriver] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useQueryState("pickupLocation");
  const [pickUpDate, setPickUpDate] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [pickUpDateTime, setPickUpDateTime] = useQueryState("pickUpDateTime");
  const [duration, setDuration] = useQueryState("duration");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Menandakan proses loading dimulai

    if (!pickUpLocation || !pickUpDate || !duration || !pickUpTime) {
      setErrorMessage("All fields are required.");
      setIsLoading(false); // Menandakan proses loading selesai
      return;
    }

    try {
      const dateTime = new Date(
        pickUpDate + "T" + pickUpTime + ":00.000Z"
      ).toISOString();
      setPickUpDateTime(dateTime);
      console.log(dateTime);

      const response = await fetch(
        `/api/vehicles/search?pickupDate=${dateTime}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      const availableVehicles = result.filter(
        (vehicle: { status: string }) => vehicle.status === "ready"
      ); // Filter kendaraan yang statusnya "ready"
      setVehicles(availableVehicles); // Update state kendaraan yang siap
      setIsLoading(false); // Menandakan proses loading selesai
      console.log(availableVehicles);
    } catch (error) {
      console.error("Error search vehicles:", error);
      setErrorMessage("An error occurred. Please try again.");
      setIsLoading(false); // Menandakan proses loading selesai
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Vehicles
          </h2>

          {/* Form Pencarian */}
          <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pick Up Location
                </h3>
                <input
                  type="text"
                  value={pickUpLocation ?? ""}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
                  placeholder="Contoh: Stasiun Tugu Yogyakarta"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pick Up Date
                </h3>
                <input
                  type="date"
                  value={pickUpDate ?? ""}
                  onChange={(e) => setPickUpDate(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Duration</h3>
                <input
                  type="number"
                  value={duration ?? ""}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
                  placeholder="Contoh: 1 day"
                  required
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Pick Up Time
                </h3>
                <input
                  type="time"
                  value={pickUpTime ?? ""}
                  onChange={(e) => setPickUpTime(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end items-center col-span-1 sm:col-span-3 mt-4">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Spinner Loading */}
        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <div className="w-12 h-12 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        <div className="mt-8 block lg:hidden">
          <button className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
            <span className="text-sm font-medium">Filters & Sorting</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 rtl:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          <div className="lg:col-span-3">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <li
                    key={vehicle.id}
                    className="border rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="inline-block rounded-full bg-green-100 px-3 py-1 m-4">
                      <span className="text-sm font-medium text-green-800">
                        Available
                      </span>
                    </div>
                    <a href="#" className="group block overflow-hidden">
                      <Image
                        src={`/api/file?filename=${
                          vehicle.images.at(0)?.imageUrl
                        }`}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="h-[200px] w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800">
                          {vehicle.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.typeId} ({vehicle.transmission})
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-lg font-semibold text-gray-900">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(vehicle.harga)}
                            /day
                          </span>
                          <button
                            onClick={() => {
                              window.location.href = `/general/booking?pickUpDateTime=${pickUpDateTime}&duration=${duration}&pickupLocation=${pickUpLocation}&vehicleId=${vehicle.id}`;
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                          >
                            Booking
                          </button>
                        </div>
                      </div>
                    </a>
                  </li>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-600">
                  No vehicles available.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
