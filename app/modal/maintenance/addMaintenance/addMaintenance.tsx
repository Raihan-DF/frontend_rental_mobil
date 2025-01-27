// Import yang dibutuhkan
"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaintenance: (maintenance: any) => void;
}

const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onAddMaintenance,
}) => {
  const [mechanicName, setMechanicName] = useState("");
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [statusMaintenance, setStatusMaintenance] = useState("in_progress"); // Default status
  const [vehicles, setVehicles] = useState([]); // List kendaraan
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch kendaraan dengan status "ready"
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Token is missing!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        // Pastikan endpoint hanya mengembalikan kendaraan "ready"
        const response = await fetch("/api/vehicles/ready", {
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();
        setVehicles(data); // Data sudah terfilter oleh backend
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Error fetching vehicles", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    if (isOpen) fetchVehicles(); // Fetch hanya saat modal dibuka
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validasi form
    if (!mechanicName || !licensePlate || !date || !details || !statusMaintenance) {
      setErrorMessage("All fields are required.");
      return;
    }

    const formattedDate = new Date(date).toISOString();

    try {
      const newMaintenance = {
        mechanicName,
        licensePlate,
        date: formattedDate,
        details,
        status: statusMaintenance,
      };

      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Token is missing!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: token,
        },
        body: JSON.stringify(newMaintenance),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add maintenance");
      }

      const data = await response.json();

      toast.success("Maintenance added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form state
      setMechanicName("");
      setLicensePlate(null);
      setDate("");
      setDetails("");
      setStatusMaintenance("in_progress");

      onAddMaintenance(data);
      onClose();
    } catch (error) {
      console.error("Error adding maintenance:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="rounded-lg bg-white p-8 shadow-lg max-w-3xl w-full">
        <h3 className="text-lg font-bold mb-4">Add Maintenance</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Mechanic Name */}
          <input
            type="text"
            placeholder="Mechanic Name"
            value={mechanicName}
            onChange={(e) => setMechanicName(e.target.value)}
            className="border p-2 rounded"
          />

          {/* License Plate Dropdown */}
          <select
            value={licensePlate || ""}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="" disabled>
              Select License Plate
            </option>
            {vehicles.map((vehicle: any) => (
              <option key={vehicle.id} value={vehicle.licensePlate}>
                {vehicle.licensePlate}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Details */}
          <textarea
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="border p-2 rounded col-span-2"
          />

          {/* Status Dropdown */}
          <select
            value={statusMaintenance}
            onChange={(e) => setStatusMaintenance(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="in_progress">in_progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Maintenance
            </button>
          </div>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
