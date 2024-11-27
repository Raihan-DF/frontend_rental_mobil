"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: any) => void;
  vehicle: any;
  onUpdateVehicle: (vehicle: any) => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onUpdateVehicle,
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

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name || "");
      setYear(vehicle.year || "");
      setTypeId(vehicle.typeId || "");
      setTransmission(vehicle.transmission || "");
      setLicensePlate(vehicle.licensePlate || "");
      setHarga(vehicle.harga || "");
      setImage(null); // Reset image when opening modal
      setFeature(vehicle.features || "");
      setDescription(vehicle.description || "");
    }
  }, [vehicle]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !year || !typeId || !transmission || !licensePlate || !harga || !features || !description) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const access_token = Cookie.get("access_token");

      const data = {
        name: name,
        year: year,
        typeId: typeId,
        transmission: transmission,
        licensePlate: licensePlate,
        harga: harga,
        gambar: image ? image.name : vehicle.gambar, // Use existing image if new not uploaded
        features: features,
        description: description,
      };

      // TODO: UPLOAD image ke file server dulu

      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Vehicle updated successfully!", { position: "top-right", autoClose: 3000 });
        onUpdateVehicle(result);
        setTimeout(onClose, 3000);
      } else {
        setErrorMessage(result.message || "Failed to update vehicle.");
        toast.error(result.message || "Failed to update vehicle.", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 3000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-lg bg-white p-8 shadow-lg max-w-3xl w-full">
        <h3 className="text-lg font-bold mb-4">Edit Vehicle</h3>
        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-4">
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
            <label className="sr-only">Image URL</label>
            <input
              type="file"
              onChange={(e) => {
                const files = e.target?.files;
                setImage(files !== null && files.length > 0 ? files[0] : null);
              }}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
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
              className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Vehicle
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditVehicleModal;
