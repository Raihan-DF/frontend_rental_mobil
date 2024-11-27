"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";
import DragComponent from "../addVehicles/uploadImage";
import { upload_multiple_file } from '@/app/actApi/uploadFile';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: any) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
}) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [transmission, setTransmission] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [harga, setHarga] = useState<number | string>("");

  const [image, setImage] = useState<File | null>(null);
  const [features, setFeature] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState<{ id: number; name: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleAddFiles = (value: File[]) => setFiles(value);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("/api/vehicles/types");
        if (!response.ok) throw new Error("Failed to fetch vehicle types");

        const data = await response.json();
        setVehicleTypes(data);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };
    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !year || !typeId || !transmission || !licensePlate || !harga || !features || !description) {
      setErrorMessage("All fields are required.");
      return;
    }

    console.log(files);

    try {
      const access_token = Cookie.get("access_token");

      if(typeof access_token === "undefined" || access_token === undefined || access_token === null){
        console.log("access token was undefined or null")
        return;
      }

      let uploadMultipleResponse = null;

      const formData = new FormData();

      // Check if image file is provided
      if(files){
        files.forEach((data) => {
          formData.append("file", data);
        });

        uploadMultipleResponse = await upload_multiple_file(formData, access_token as string);

        console.log(uploadMultipleResponse);
      }

      const resultUploadedImages: string[] = uploadMultipleResponse.img_paths;

      console.log(resultUploadedImages);

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify({
          name: name,
          year: year,
          typeId: typeId,
          transmission: transmission,
          licensePlate: licensePlate,
          harga: harga,
          gambar: resultUploadedImages, // Send the image URL or empty string
          features: features,
          description: description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Vehicle added successfully!", { position: "top-right", autoClose: 3000 });
        onAddVehicle(result);
        setTimeout(onClose, 3000);
      } else {
        setErrorMessage(result.message || "Failed to add vehicle.");
        toast.error(result.message || "Failed to add vehicle.", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 3000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-lg bg-white p-8 shadow-lg max-w-3xl w-full">
        <h3 className="text-lg font-bold mb-4">Add Vehicle</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="sr-only">Vehicle Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vehicle Name"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="Year"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Type</label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(Number(e.target.value))}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            >
              <option value="">Select Type</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only">Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            >
              <option value="">Select Transmission</option>
              <option value="Matic">Matic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="sr-only">License Plate</label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="License Plate"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Price (in Rupiah)</label>
            <input
              type="number"
              value={harga}
              onChange={(e) => {
                const value = e.target.value;
                setHarga(value === "0" ? "" : value ? Number(value) : "");
              }}
              placeholder="Price"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Features</label>
            <input
              type="text"
              value={features}
              onChange={(e) => setFeature(e.target.value)}
              placeholder="Features"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="sr-only">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              rows={3}
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm col-span-2 mb-4">{errorMessage}</p>
          )}
          <DragComponent setFiles={handleAddFiles}/>
          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddVehicleModal;