"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Maintenance {
  id: number;
  vehicleId: number;
  date: string;
  mechanicName: string;
  details: string;
  status: string;
  vehicle: {
    id: number;
    name: string;
    licensePlate: string;
    status: string;
  };
}

interface EditMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceId: number;
  onEditMaintenance: (maintenance: Maintenance) => void;
}

const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({
  isOpen,
  onClose,
  maintenanceId,
  onEditMaintenance,
}) => {
  const [formData, setFormData] = useState({
    status: "",
    licensePlate: "",
    mechanicName: "",
    date: "",
    details: "",
    vehicleName: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && maintenanceId) {
      fetchMaintenanceDetails();
    }
  }, [isOpen, maintenanceId]);

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        headers: {
          "Content-Type": "application/json",
          AccessToken: localStorage.getItem("access_token") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch maintenance details");
      }

      const data = await response.json();
      setFormData({
        status: data.status,
        licensePlate: data.vehicle.licensePlate,
        mechanicName: data.mechanicName,
        date: data.date,
        details: data.details,
        vehicleName: data.vehicle.name,
      });
    } catch (error) {
      console.error("Error fetching maintenance details:", error);
      toast.error("Failed to fetch maintenance details. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          AccessToken: localStorage.getItem("access_token") || "",
        },
        body: JSON.stringify({ status: formData.status }), // Hanya status yang dikirim
      });

      if (!response.ok) {
        throw new Error("Failed to update maintenance record");
      }

      const updatedMaintenance = await response.json();
      onEditMaintenance(updatedMaintenance); // Kirim data hasil update ke parent
      toast.success("Maintenance record updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating maintenance record:", error);
      toast.error("Failed to update maintenance record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="rounded-lg bg-white p-8 shadow-lg max-w-3xl w-full">
        <h3 className="text-lg font-bold mb-4">Edit Maintenance</h3>
        <form onSubmit={handleSubmit}>
          {/* Vehicle Name */}
          <div className="mb-4">
            <label className="block">Vehicle Name:</label>
            <input
              type="text"
              value={formData.vehicleName}
              readOnly
              className="w-full border p-2 mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* License Plate */}
          <div className="mb-4">
            <label className="block">License Plate:</label>
            <input
              type="text"
              value={formData.licensePlate}
              readOnly
              className="w-full border p-2 mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Mechanic Name */}
          <div className="mb-4">
            <label className="block">Mechanic Name:</label>
            <input
              type="text"
              value={formData.mechanicName}
              readOnly
              className="w-full border p-2 mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block">Date:</label>
            <input
              type="text"
              value={formData.date}
              readOnly
              className="w-full border p-2 mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Details */}
          <div className="mb-4">
            <label className="block">Details:</label>
            <textarea
              value={formData.details}
              readOnly
              className="w-full border p-2 mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Status Dropdown */}
          <div className="mb-4">
            <label className="block">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 mt-1"
            >
              <option value="on-progress">On Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Updating..." : "Update Maintenance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;
