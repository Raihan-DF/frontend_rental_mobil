"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cookie from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadFile } from "@/app/actApi/uploadFile";
import { convertTimezone } from "@/utilities/time_convert";
interface VehicleType {
  id: number;
  typeName: string;
}

interface Vehicle {
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
  type: VehicleType;
  images: string[];
}

export default function Booking() {
  const [isDriver, setIsDriver] = useState(true); // Default to true (with driver)
  const [pickupLocation, setPickupLocation] = useQueryState("pickupLocation");
  const [pickupDateTime, setPickupDateTime] = useQueryState("pickUpDateTime");
  const [vehicleId, setVehicleId] = useQueryState("vehicleId");
  const [duration, setDuration] = useQueryState("duration");

  const [driverName, setdriverName] = useState("");
  const [driverPhone, setdriverPhone] = useState("");
  const [driverAddress, setdriverAddress] = useState("");
  const [returnLocation, setreturnLocation] = useState("");
  const [descriptionLocation, setdescriptionLocation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle>();

  const [paymentMethod, setPaymentMethod] = useState<string>(""); // State untuk metode pembayaran
  const [isDownPayment, setisDownPayment] = useState<number | "">(""); // State untuk biaya DP
  const [proofOfTransfer, setProofOfTransfer] = useState<File | null>(null); // State untuk file bukti transfer

  useEffect(() => {
    const fetchVehicleByID = async () => {
      const response = await fetch(`/api/vehicles/get_id/${vehicleId}`, {
        method: "GET",
      });
      const result = await response.json();
      console.log(JSON.stringify(result));
      setVehicle(result);
    };
    fetchVehicleByID();
  }, [vehicleId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const parsedDuration = parseInt(duration || "0", 10);

    // Validasi frontend
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setErrorMessage("Duration must be a valid number.");
      toast.error("Duration must be a valid number.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Validasi data untuk skenario tanpa driver
    if (
      !isDriver &&
      (!driverName ||
        !driverPhone ||
        !driverAddress ||
        !returnLocation ||
        !descriptionLocation)
    ) {
      setErrorMessage("All fields are required for without driver option.");
      return;
    }

    if(!proofOfTransfer){
      setErrorMessage("Harus mengirimkan bukti transfer!");
      return;
    }

    try {
      const access_token = Cookie.get("access_token");
      if(typeof access_token === "undefined" || !access_token){
        setErrorMessage("Access Token Tidak tersedia!");
        return;
      }
      // Perhitungan amount dan isDownPayment sesuai backend
      const vehiclePricePerHour = vehicle?.harga || 0;
      const driverCostPerHour = 500000; // Biaya driver per jam
      const calculatedAmount = isDriver
        ? parsedDuration * (vehiclePricePerHour + driverCostPerHour)
        : parsedDuration * vehiclePricePerHour;

      const downPayment = vehiclePricePerHour * 1; // Uang muka = harga kendaraan selama 1 jam

      const formFile = new FormData();
      formFile.append('file',proofOfTransfer)
      const resultUploadFile = await UploadFile(formFile, access_token);
      const namaFile = resultUploadFile.img_path;
      console.log("Berhasil upload", namaFile);

      const bodyData = {
        vehicleId: vehicle?.id, // Pastikan hanya ID yang dikirim
        pickupLocation: pickupLocation,
        pickupDateTime: pickupDateTime,
        duration: parsedDuration,
        withDriver: isDriver,
        amount: calculatedAmount,
        paymentMethod: "CASH", // Default payment method
        isDownPayment: downPayment, // Menggunakan DP
        paymentProof: namaFile, // Bisa diganti URL valid
        ...(isDriver
          ? {} // Tidak mengirim data driver jika dengan driver
          : {
              driverName: driverName,
              driverPhone: driverPhone,
              driverAddress: driverAddress,
              returnLocation: returnLocation,
              descriptionLocation: descriptionLocation,
            }),
      };
      console.log("ini data:", bodyData);
      const response = await fetch("/api/bookings/create-booking-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Booking added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.href="/customer/profile?page=MyOrder"
        }, 1000);
      } else {
        setErrorMessage(result.message || "Failed to add booking.");
        toast.error(result.message || "Failed to add booking.", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProofOfTransfer(event.target.files[0]);
    }
  };

  return (
    <section>
      <ToastContainer />
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Booking
          </h2>
        </header>
        <div>
          <div className="flex items-start p-4 border-b border-gray-200">
            {/* Gambar Mobil */}
            <Image
              src={`/api/file?filename=${vehicle?.images[0] ?? ""}`}
              alt={vehicle?.images[0] ?? ""}
              width={250}
              height={250}
              className="h-[150px] w-full object-cover"
            />
            <Image
              src={`/api/file?filename=${vehicle?.images[1] ?? ""}`}
              alt={vehicle?.images[1] ?? ""}
              width={250}
              height={250}
              className="h-[150px] w-full object-cover"
            />

            {/* Nama Kendaraan dan Fitur */}
            <div className="ml-4 flex flex-col">
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {vehicle?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {vehicle?.typeId} ({vehicle?.transmission})
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(vehicle?.harga ?? 0)}
                    /day
                  </span>
                </div>
                <h3 className="pt-2 text-lg font-bold text-green-800">
                  {vehicle?.features}
                </h3>
              </div>
            </div>
          </div>

          {/* Detail Pengemudi atau Input jika tanpa driver */}
          <div className="pt-6 pb-2">
            <p className="text-l font-bold text-gray-900 sm:text-xl">
              Detail Booking
            </p>
          </div>

          {/* Pilihan dengan driver atau tanpa driver */}
          <div className="pt-4">
            <fieldset className="grid grid-cols-4 gap-4 pb-4">
              <legend className="sr-only">Booking Option</legend>

              <div>
                <label
                  htmlFor="WithDriver"
                  className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                >
                  <div>
                    <p className="text-gray-700">With Driver</p>
                  </div>

                  <input
                    type="radio"
                    name="BookingOption"
                    value="WithDriver"
                    id="WithDriver"
                    className="sr-only"
                    checked={isDriver}
                    onChange={() => setIsDriver(true)}
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor="WithoutDriver"
                  className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                >
                  <div>
                    <p className="text-gray-700">Without Driver</p>
                  </div>

                  <input
                    type="radio"
                    name="BookingOption"
                    value="WithoutDriver"
                    id="WithoutDriver"
                    className="sr-only"
                    checked={!isDriver}
                    onChange={() => setIsDriver(false)}
                  />
                </label>
              </div>
            </fieldset>
          </div>

          <div className="flow-root">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Pickup Location</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {pickupLocation}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Pickup Date Time</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {convertTimezone(pickupDateTime??"")}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Duration</dt>
                <dd className="text-gray-700 sm:col-span-2">{duration}</dd>
              </div>

              {/* Kondisi untuk driver */}
              {isDriver ? (
                <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Driver Info</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    Driver will be assigned
                  </dd>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Input untuk tanpa driver */}
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-900">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setdriverName(e.target.value)}
                      className="col-span-2 p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-900">
                      Driver Phone
                    </label>
                    <input
                      type="text"
                      value={driverPhone}
                      onChange={(e) => setdriverPhone(e.target.value)}
                      className="col-span-2 p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-900">
                      Driver Address
                    </label>
                    <input
                      type="text"
                      value={driverAddress}
                      onChange={(e) => setdriverAddress(e.target.value)}
                      className="col-span-2 p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-900">
                      Return Location
                    </label>
                    <input
                      type="text"
                      value={returnLocation}
                      onChange={(e) => setreturnLocation(e.target.value)}
                      className="col-span-2 p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <label className="font-medium text-gray-900">
                      Description Location
                    </label>
                    <input
                      type="text"
                      value={descriptionLocation}
                      onChange={(e) => setdescriptionLocation(e.target.value)}
                      className="col-span-2 p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}
            </dl>
          </div>
          <div className="pt-6 pb-4">
            <p className="text-l font-bold text-gray-900 sm:text-xl mb-4">
              Payment Method
            </p>

            {/* Pilihan Metode Pembayaran */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Payment Method
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Cash</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Transfer</span>
                </label>
              </div>
            </div>

            {/* Jika metode cash */}
            {paymentMethod === "cash" && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-6">
                  <label
                    htmlFor="dpAmount"
                    className="block text-lg font-semibold text-gray-800 mb-2"
                  >
                    DP Amount
                  </label>
                  <div className="flex justify-between items-center mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <span className="text-base font-bold text-gray-700">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(vehicle?.harga ?? 0)}{" "}
                      /day
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="proofOfTransfer"
                    className="block text-lg font-semibold text-gray-800 mb-2"
                  >
                    Upload Transfer Proof
                  </label>
                  <div className="relative flex items-center bg-gray-50 p-4 rounded-md border border-gray-200 hover:border-blue-400 focus-within:ring focus-within:ring-blue-500 focus-within:ring-opacity-50">
                    <input
                      type="file"
                      id="proofOfTransfer"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 border-none focus:outline-none"
                    />
                  </div>
                  {proofOfTransfer && (
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Selected file:{" "}
                      <span className="text-gray-800 font-semibold">
                        {proofOfTransfer.name}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Jika metode transfer */}
            {paymentMethod === "transfer" && (
              <div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Bank Info</p>
                  <ul className="text-sm text-gray-600 mt-2">
                    <li>Bank Name: ABC Bank</li>
                    <li>Account Name: Rental Mobil</li>
                    <li>Account Number: 123456789</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="proofOfTransfer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Transfer Proof
                  </label>
                  <input
                    type="file"
                    id="proofOfTransfer"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {proofOfTransfer && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {proofOfTransfer.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center col-span-1 sm:col-span-3 mt-4">
            <button
              onClick={handleBooking}
              className="px-4 py-2 pb-2 pt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Booking Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
