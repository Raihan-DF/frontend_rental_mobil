import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface Expense {
//   id: number;
//   expenseName: string;
//   quantity: number;
//   price: number;
//   date: string;
//   isMaintenance: boolean;
//   maintenanceId?: number | null;
// }
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
  expense?: Expense; // Opsional agar modal tetap fleksibel
  onUpdateExpense: (updatedExpense: Expense) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onUpdateExpense,
}) => {
  const [expenseName, setExpenseName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceId, setMaintenanceId] = useState<number | "">("");

  // Mengisi state dengan data expense saat modal dibuka
  useEffect(() => {
    if (expense) {
      setExpenseName(expense.expenseName || "");
      setQuantity(expense.quantity || 1);
      setPrice(expense.price || "");
      setDate(expense.date?.split("T")[0] || ""); // Format YYYY-MM-DD
      setIsMaintenance(expense.isMaintenance || false);
      setMaintenanceId(expense.maintenanceId || "");
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = new Date(date).toISOString();

    if (!expenseName || !price || !quantity || !date) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedExpense: Expense = {
      ...expense!,
      expenseName,
      quantity,
      price: Number(price),
      date: formattedDate,
      isMaintenance,
      maintenanceId: isMaintenance ? Number(maintenanceId) : null,
    };

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Token is missing!", { position: "top-right", autoClose: 3000 });
        return;
      }

      // Kirim request ke backend menggunakan fetch
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
        console.error("Error Response:", errorData);
        throw new Error("Failed to update expense.");
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
          <div>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Expense Name"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Price (in Rupiah)"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <select
              value={isMaintenance ? "maintenance" : "other"}
              onChange={(e) => setIsMaintenance(e.target.value === "maintenance")}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
            >
              <option value="other">Other</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          {isMaintenance && (
            <div>
              <input
                type="number"
                value={maintenanceId}
                onChange={(e) => setMaintenanceId(Number(e.target.value))}
                placeholder="Maintenance ID"
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
              />
            </div>
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
