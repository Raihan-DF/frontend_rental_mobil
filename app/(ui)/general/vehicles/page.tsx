"use client";
import KijangInova from "../../../../assets/images/kijang_inova.png";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";
import noCar from "@/assets/images/no-car.png";

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
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    []
  );
  const [selectedPrice, setSelectedPrice] = useState([500000, 1000000000]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  // useEffect(() => {
  //   const fetchVehicles = async () => {
  //     try {
  //       const response = await fetch("/api/vehicles");
  //       if (!response.ok) throw new Error("Error fetching vehicles data");
  //       const data = await response.json();
  //       setVehicles(data); // Data yang ditampilkan
  //       setAllVehicles(data); // Data asli untuk filtering
  //     } catch (error) {
  //       console.error("Error fetching vehicles:", error);
  //     }
  //   };

  //   fetchVehicles();
  // }, []);

  const applyFilters = () => {
    let filteredVehicles = allVehicles;

    // Filter berdasarkan transmission
    if (selectedTransmission.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedTransmission.includes(vehicle.transmission)
      );
    }

    // Filter berdasarkan harga
    filteredVehicles = filteredVehicles.filter(
      (vehicle) =>
        vehicle.harga >= selectedPrice[0] && vehicle.harga <= selectedPrice[1]
    );

    // Filter berdasarkan type
    if (selectedType.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedType.includes(vehicle.type.typeName)
      );
    }

    // Update state vehicles
    setVehicles(filteredVehicles);
  };

  // Trigger applyFilters setiap kali filter berubah
  // useEffect(() => {
  //   applyFilters();
  // }, [selectedTransmission, selectedPrice, selectedType]);

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedTransmission((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedType((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
  };

  const resetFilters = () => {
    setSelectedTransmission([]);
    setSelectedPrice([500000, 1000000000]);
    setSelectedType([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    let hasError = false;

    // Cek inputan satu per satu dan beri feedback
    if (!pickUpLocation) {
      toast.error("Pick Up Location is required.");
      hasError = true;
    }

    if (!pickUpDate) {
      toast.error("Pick Up Date is required.");
      hasError = true;
    }

    if (!pickUpTime) {
      toast.error("Pick Up Time is required.");
      hasError = true;
    }

    if (!duration) {
      toast.error("Duration is required.");
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      return; // Jika ada input yang kosong, hentikan eksekusi
    }

    if (!pickUpLocation || !pickUpDate || !duration || !pickUpTime) {
      toast.error("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const pickUpDateTime = new Date(
        `${pickUpDate}T${pickUpTime}:00.000Z`
      ).toISOString();
      setPickUpDateTime(pickUpDateTime); // Tetap simpan pickupDateTime ke state

      console.log("Sending pickupDateTime:", pickUpDateTime);

      const response = await fetch(
        `/api/vehicles/search?pickupDate=${pickUpDateTime}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles.");
      }

      const result = await response.json();
      console.log("Received vehicles:", result);

      // Filter kendaraan yang statusnya "ready"
      let availableVehicles = result.filter(
        (vehicle: { status: string }) => vehicle.status === "ready"
      );
      // setVehicles(availableVehicles); // Update state kendaraan
      setIsLoading(false);
      if (selectedTransmission.length > 0) {
        availableVehicles = availableVehicles.filter((vehicle:any) =>
          selectedTransmission.includes(vehicle.transmission)
        );
      }
  
      // Filter berdasarkan harga
      availableVehicles = availableVehicles.filter(
        (vehicle:any) =>
          vehicle.harga >= selectedPrice[0] && vehicle.harga <= selectedPrice[1]
      );
  
      // Filter berdasarkan type
      if (selectedType.length > 0) {
        availableVehicles = availableVehicles.filter((vehicle:any) =>
          selectedType.includes(vehicle.type.typeName)
        );
      }
  
      // Update state vehicles
      setVehicles(availableVehicles);
      toast.success("Vehicles successfully loaded.");
    } catch (error) {
      console.error("Error in vehicle search:", error);
      setErrorMessage("An error occurred. Please try again.");
      setIsLoading(false);
      toast.error("Failed to fetch vehicles. Please try again.");
    }
  };
  if(!pickUpLocation || !pickUpDateTime || !duration){
    return (
      <div>
        <header className="mt-10 mb-28">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Vehicles
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="h-32 rounded-lg bg-gray-200">
              <div className="lg:col-span-1 h-auto rounded-lg bg-gray-200 p-4">
                {/* Filter Sidebar */}
                <h3 className="text-lg font-semibold mb-4">Filter</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                  Reset Filters
                </button>

                {/* Transmission Filter */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-600">Transmission</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Matic"
                        checked={selectedTransmission.includes("Matic")}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      Matic
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Manual"
                        checked={selectedTransmission.includes("Manual")}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      Manual
                    </label>
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-600">Price per Day</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="500000-1000000000"
                        checked={selectedPrice[0] === 500000}
                        onChange={() => setSelectedPrice([500000, 1000000000])}
                        className="mr-2"
                      />
                      Rp 500,000 - Rp 1,000,000,000
                    </label>
                  </div>
                </div>

                {/* Vehicle Type Filter */}
                <div>
                  <h4 className="font-medium text-gray-600">Vehicle Type</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Minivan"
                        checked={selectedType.includes("Minivan")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      Minivan
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="SUV"
                        checked={selectedType.includes("SUV")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      SUV
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="MPV"
                        checked={selectedType.includes("MPV")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      MPV
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-auto rounded-lg bg-gray-200 lg:col-span-2">
              {/* Form Pencarian */}
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
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
                    <h3 className="text-sm font-medium text-gray-600">
                      Duration
                    </h3>
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
            </div>
          </div>
        </header>
      </div>
    )
  }
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mt-10 mb-28">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Vehicles
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="h-32 rounded-lg bg-gray-200">
              <div className="lg:col-span-1 h-auto rounded-lg bg-gray-200 p-4">
                {/* Filter Sidebar */}
                <h3 className="text-lg font-semibold mb-4">Filter</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                  Reset Filters
                </button>

                {/* Transmission Filter */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-600">Transmission</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Matic"
                        checked={selectedTransmission.includes("Matic")}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      Matic
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Manual"
                        checked={selectedTransmission.includes("Manual")}
                        onChange={handleTransmissionChange}
                        className="mr-2"
                      />
                      Manual
                    </label>
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-600">Price per Day</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="500000-1000000000"
                        checked={selectedPrice[0] === 500000}
                        onChange={() => setSelectedPrice([500000, 1000000000])}
                        className="mr-2"
                      />
                      Rp 500,000 - Rp 1,000,000,000
                    </label>
                  </div>
                </div>

                {/* Vehicle Type Filter */}
                <div>
                  <h4 className="font-medium text-gray-600">Vehicle Type</h4>
                  <div className="flex flex-col">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Minivan"
                        checked={selectedType.includes("Minivan")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      Minivan
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="SUV"
                        checked={selectedType.includes("SUV")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      SUV
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="MPV"
                        checked={selectedType.includes("MPV")}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      MPV
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-auto rounded-lg bg-gray-200 lg:col-span-2">
              {/* Form Pencarian */}
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
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
                    <h3 className="text-sm font-medium text-gray-600">
                      Duration
                    </h3>
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
                <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                  <Image
                    src={noCar}
                    alt="noCar"
                    width={300}
                    height={200}
                    className="object-cover rounded-lg" // Menggunakan object-cover dan rounded untuk mempercantik
                  />
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
