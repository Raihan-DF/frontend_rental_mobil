import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Expense {
  id: number;
  expenseName: string;
  quantity: number;
  date: string; // Format: YYYY-MM-DD
  price: number;
  total: number;
  isMaintenance: boolean;
  maintenanceId?: number | null; // Optional jika tidak maintenance
}

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onUpdateExpense: (updatedExpense: Expense) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onUpdateExpense,
}) => {
  const [name, setName] = useState("");

  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("maintenance");
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [maintenanceVehicles, setMaintenanceVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setName(expense.expenseName);
      setAmount(expense.price);
      setDate(expense.date);
      setQuantity(expense.quantity);
      setType(expense.isMaintenance ? "maintenance" : "other");
      setSelectedVehicle(
        expense.maintenanceId ? String(expense.maintenanceId) : null
      );
    }
  }, [expense]);

  useEffect(() => {
    const fetchMaintenanceVehicles = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          toast.error("Token is missing!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        const response = await fetch("/api/expense/maintenance-vehicles", {
          headers: { AccessToken: token },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch maintenance vehicles");
        }

        const data = await response.json();
        setMaintenanceVehicles(data);
      } catch (error) {
        console.error("Error fetching maintenance vehicles:", error);
        toast.error("Error fetching maintenance vehicles", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    if (type === "maintenance") {
      fetchMaintenanceVehicles();
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !amount || !date || !type) {
      setErrorMessage("All fields are required.");
      return;
    }

    const formattedDate = new Date(date).toISOString();

    try {
      if (isNaN(Number(amount))) {
        setErrorMessage("Amount must be a valid number.");
        return;
      }

      const maintenanceId =
        type === "maintenance" && selectedVehicle
          ? Number(selectedVehicle)
          : null;

      const updatedExpense = {
        id: expense?.id,
        expenseName: name,
        quantity: quantity,
        date: formattedDate,
        price: amount,
        isMaintenance: type === "maintenance",
        maintenanceId: maintenanceId,
      };

      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Token is missing!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch(`/api/expense/${expense?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          AccessToken: token,
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update expense");
      }

      const data = await response.json();

      toast.success("Expense updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      onUpdateExpense(data);
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
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
        <h3 className="text-lg font-bold mb-4">Edit Expense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            id="expense-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Expense Name"
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            required
          />
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="quantity (in Rupiah)"
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            required
          />
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount (in Rupiah)"
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            required
          />
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            required
          />
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            required
          >
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>

          {type === "maintenance" && (
            <select
              id="maintenance-vehicle"
              value={selectedVehicle || ""}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-3 text-sm col-span-2"
              required
            >
              <option value="" disabled>
                Select Vehicle (Name + License Plate)
              </option>
              {maintenanceVehicles.map((vehicle: any) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm col-span-2 mb-4">
              {errorMessage}
            </p>
          )}

          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
