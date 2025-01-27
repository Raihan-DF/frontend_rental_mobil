"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cookie from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadFile } from "@/app/actApi/uploadFile";
import { convertTimezone } from "@/utilities/time_convert";
import {
  Radio,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
interface VehicleType {
  id: number;
  typeName: string;
}
export interface Images {
  id: number;
  imageUrl: string;
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
  images: Images[];
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

  const [paymentMethod, setPaymentMethod] = useState<string>("CASH"); // State untuk metode pembayaran
  const [isDownPayment, setisDownPayment] = useState<number | "">(""); // State untuk biaya DP
  const [proofOfTransfer, setProofOfTransfer] = useState<File | null>(null); // State untuk file bukti transfer

  const data = [
    {
      label: "Arrive on time",
      value: "arriveOnTime",
      desc: `Perusahaan persewaan hanya mengizinkan Anda mengambil kunci pada waktu penjemputan yang telah ditentukan.
      Waktu penjemputan Anda adalah pukul 10:00 AM.`,
    },
    {
      label: "What to bring with you",
      value: "whatToBring",
      desc: `Saat Anda mengambil mobil, Anda memerlukan:
      - Paspor atau kartu tanda penduduk nasional
      - Semua pengemudi harus menunjukkan SIM
      - Kartu kredit atau debit atas nama pengemudi utama, untuk menyimpan uang jaminan`,
    },
  ];

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

    if (!proofOfTransfer && paymentMethod === "CASH") {
      setErrorMessage("Harus mengirimkan bukti transfer!");
      return;
    }

    try {
      const access_token = Cookie.get("access_token");
      if (typeof access_token === "undefined" || !access_token) {
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
      let namaFile: string | null = null;
      if (paymentMethod === "CASH" && proofOfTransfer) {
        formFile.append("file", proofOfTransfer);
        const resultUploadFile = await UploadFile(formFile, access_token);
        namaFile = resultUploadFile.img_path;
        console.log("Berhasil upload", namaFile);
      }

      const bodyData = {
        vehicleId: vehicle?.id, // Pastikan hanya ID yang dikirim
        pickupLocation: pickupLocation,
        pickupDateTime: pickupDateTime,
        duration: parsedDuration,
        withDriver: isDriver,
        amount: calculatedAmount,
        paymentMethod: paymentMethod, // Default payment method
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

      console.log(result);

      if (response.ok) {
        toast.success("Booking added successfully!", {
          position: "top-right",
          autoClose: 1000,
        });

        if (paymentMethod === "TRANSFER") {
          window.location.href = result.url;
        }

        setTimeout(() => {
          window.location.href = "/customer/profile?page=MyOrder";
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
          <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl text-center">
            Booking
          </h2>
        </header>
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-start gap-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Gambar Mobil (Hanya gambar pertama ditampilkan besar) */}
            <div className="w-full md:w-1/2">
              <Image
                src={`/api/file?filename=${
                  vehicle?.images.at(0)?.imageUrl ?? ""
                }`}
                alt={vehicle?.name ?? "Vehicle Image"}
                width={500}
                height={300}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>

            {/* Nama Kendaraan dan Fitur */}
            <div className="w-full md:w-1/2 flex flex-col justify-between px-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {vehicle?.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {vehicle?.typeId} • {vehicle?.transmission}
                </p>
                <p className="text-xl font-semibold text-green-600 mb-6">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(vehicle?.harga ?? 0)}{" "}
                  /day
                </p>
              </div>

              {/* Fitur Kendaraan */}
              <div className="mt-4 flex flex-wrap gap-3">
                {vehicle?.features.split(",").map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {feature.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Pengemudi atau Input jika tanpa driver */}
          <div className="pt-6 pb-2">
            {/* Background biru muda untuk bagian Detail Booking */}
            <p className="text-l font-bold text-white sm:text-2xl text-center bg-blue-600 py-6 px-4 rounded-lg shadow-md">
              Detail Booking
            </p>
          </div>

          {/* Wrapper untuk konten booking */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            {/* Pilihan dengan driver atau tanpa driver */}
            <div className="pt-4">
              <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                <legend className="sr-only">Booking Option</legend>

                <div>
                  <label
                    htmlFor="WithDriver"
                    className={`block cursor-pointer rounded-lg border p-4 text-sm font-medium shadow-sm hover:border-blue-500 ${
                      isDriver
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "border-gray-100 bg-white"
                    }`}
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
                    className={`block cursor-pointer rounded-lg border p-4 text-sm font-medium shadow-sm hover:border-blue-500 ${
                      !isDriver
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "border-gray-100 bg-white"
                    }`}
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
                  <dt className="font-medium text-gray-900">
                    Pickup Date Time
                  </dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {convertTimezone(pickupDateTime ?? "")}
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
                        className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Enter driver's name"
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
                        className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Enter driver's phone number"
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
                        className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Enter driver's address"
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
                        className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Enter return location"
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
                        className="col-span-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Enter description of location"
                      />
                    </div>
                    <div className="mb-6">
                      <p className="text-xl font-semibold text-gray-800 mb-4">
                        Your pick-up checklist
                      </p>
                      <div className="border border-gray-300 shadow-lg p-6 rounded-md bg-white">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                          Data yang diperlukan:
                        </p>
                        <ul className="list-inside list-disc text-gray-800 text-base">
                          <li>Paspor atau kartu tanda penduduk nasional</li>
                          <li>Semua pengemudi harus menunjukkan SIM</li>
                          <li>
                            Kartu kredit atau debit atas nama pengemudi utama,
                            untuk menyimpan uang jaminan
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="pt-6 pb-4">
            <p className="text-l font-bold text-gray-900 sm:text-xl mb-4">
              Payment Method
            </p>

            {/* Pilihan Metode Pembayaran */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select Payment Method
              </label>
              <div className="flex items-center gap-6 mt-2">
                <Radio
                  name="paymentMethod"
                  label="Cash"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-gray-700"
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Radio
                  name="paymentMethod"
                  label="Transfer"
                  value="TRANSFER"
                  checked={paymentMethod === "TRANSFER"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-gray-700"
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
            </div>

            {/* Jika metode cash */}
            {paymentMethod === "CASH" && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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
                      }).format(1000000)}{" "}
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
            {paymentMethod === "TRANSFER" && (
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold text-blue-700">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Important Information
                </p>
                <p className="mt-4 text-base text-gray-800">
                  You will be redirected to the payment gateway to complete the
                  transfer.
                </p>
                <p className="mt-2 text-sm text-blue-600">
                  Please follow the instructions on the gateway page for
                  successful payment.
                </p>
              </div>
            )}

            {/* Tombol Cancel dan Booking Now */}
            <div className="flex justify-end items-center gap-4 mt-6">
              <button
                onClick={() => (window.location.href = "/general/vehicles")}
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Booking Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
