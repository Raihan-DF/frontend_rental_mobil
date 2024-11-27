import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: any) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
}) => {
  const [name, setName] = useState(""); // Nama pengeluaran
  const [description, setDescription] = useState(""); // Deskripsi untuk ID maintenance (jika maintenance)
  const [amount, setAmount] = useState<number | "">(""); // Jumlah harga
  const [date, setDate] = useState(""); // Tanggal pengeluaran
  const [type, setType] = useState("maintenance"); // Jenis pengeluaran, defaultnya maintenance
  const [quantity, setQuantity] = useState(1); // Defaultkan jumlah ke 1
  const [errorMessage, setErrorMessage] = useState(""); // Pesan error jika ada kesalahan

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    // Validasi form
    if (!name || !amount || !date || !type) {
      setErrorMessage("All fields are required.");
      return;
    }

    const formattedDate = new Date(date).toISOString();

    try {
      // Memeriksa apakah amount adalah angka valid
      if (isNaN(Number(amount))) {
        setErrorMessage("Amount must be a valid number.");
        return;
      }

      // Membuat objek expense yang akan dikirim ke backend
      const newExpense = {
        expenseName: name, // Menyesuaikan dengan backend
        quantity,
        date: formattedDate,
        price: amount, // Menggunakan amount sebagai price
        isMaintenance: type === "maintenance", // Jika type maintenance, maka isMaintenance true
        maintenanceId: type === "maintenance" && description ? parseInt(description) : null, // Jika maintenance, gunakan description untuk maintenanceId
      };

      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Token is missing!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Kirim request ke backend menggunakan fetch
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: token, // Kirim token di header
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }

      const data = await response.json();

      toast.success("Expense added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form setelah berhasil
      setName("");
      setDescription("");
      setAmount("");
      setDate("");
      setQuantity(1);
      setType("maintenance");
      onAddExpense(data); // Menambahkan expense baru ke list
      onClose(); // Menutup modal setelah berhasil
    } catch (error) {
      console.error("Error adding expense:", error);
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
        <h3 className="text-lg font-bold mb-4">Add Expense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Expense Name & Amount */}
          <div>
            <label htmlFor="expense-name" className="sr-only">
              Expense Name
            </label>
            <input
              id="expense-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Expense Name"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="sr-only">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="sr-only">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount (in Rupiah)"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>

          {/* Date & Maintenance */}
          <div>
            <label htmlFor="date" className="sr-only">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="sr-only">
              Expense Type
            </label>
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
          </div>

          {/* Description - Only show if type is maintenance */}
          {type === "maintenance" && (
            <div className="col">
              <label htmlFor="description" className="sr-only">
                Maintenance ID
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Maintenance ID (if applicable)"
                className="w-full rounded-lg border-gray-200 p-3 text-sm"
              />
            </div>
          )}

          {/* Error Message */}
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

export default AddExpenseModal;
