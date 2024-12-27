import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(ui)/admin/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(ui)/admin/components/ui/table";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import AddExpenseModal from "@/app/components/modal/expense/addExpense/page";
import EditExpenseModal from "@/app/components/modal/expense/editExpense/page";

// Definisikan tipe untuk Expense
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

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]); // Untuk menyimpan hasil filter
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(
    undefined
  );

  // State untuk pencarian
  const [searchName, setSearchName] = useState("");
  const [isDateRangeChecked, setIsDateRangeChecked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Mengambil data pengeluaran dari API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("/api/expense", {
          headers: {
            "Content-Type": "application/json",
            AccessToken: accessToken || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching expenses data");

        const data = await response.json();

        // Mapping data dari backend ke format frontend
        const mappedData = data.map((expense: any) => ({
          id: expense.id,
          expenseName: expense.expenseName,
          quantity: expense.quantity,
          date: new Date(expense.date).toISOString().split("T")[0],
          price: expense.price,
          total: expense.total,
          isMaintenance: expense.isMaintenance,
          maintenanceId: expense.maintenanceId,
        }));

        setExpenses(mappedData);
        setFilteredExpenses(mappedData); // Inisialisasi filteredExpenses dengan data awal
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Fungsi pencarian berdasarkan nama dan rentang tanggal
  const handleSearch = () => {
    let filtered = expenses;

    // Filter berdasarkan nama
    if (searchName) {
      filtered = filtered.filter((expense) =>
        expense.expenseName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter berdasarkan rentang tanggal jika checkbox dicentang
    if (isDateRangeChecked && startDate && endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return expenseDate >= start && expenseDate <= end;
      });
    }

    // Update filteredExpenses dengan hasil filter
    setFilteredExpenses(filtered);
  };

  // Fungsi untuk membuka modal edit
  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  // Fungsi untuk memperbarui pengeluaran setelah edit
  const handleUpdateExpense = (updatedExpense: Expense): void => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id
          ? {
              ...expense,
              expenseName: updatedExpense.expenseName,
              quantity: updatedExpense.quantity,
              price: updatedExpense.price,
              total: updatedExpense.total,
            } // Memperbarui semua properti yang diubah
          : expense
      )
    );
    setIsEditModalOpen(false); // Menutup modal setelah update
  };

  // Fungsi untuk melakukan soft delete
  const handleSoftDelete = async (id: number) => {
    try {
      const response = await fetch(`api/expense/${id}/softdelete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accesstoken: localStorage.getItem("access_token") || "", // Ambil token dari localStorage atau tempat lain
        },
      });

      if (response.ok) {
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        alert("Expense berhasil dihapus!");
      } else {
        alert("Gagal menghapus expense!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus expense.");
    }
  };

  // Efek samping: reset filteredExpenses ketika teks pencarian kosong
  useEffect(() => {
    if (!searchName) {
      setFilteredExpenses(expenses); // Tampilkan semua data jika pencarian kosong
    }
  }, [searchName, expenses]);

  return (
    <Card>
      <CardHeader className="px-7 relative">
        <CardTitle>Expenses</CardTitle>
        <CardDescription>List of all expenses recorded.</CardDescription>
        <div className="absolute top-4 right-4">
          <Icon
            icon="mdi:plus"
            className="cursor-pointer text-green-500 hover:text-green-600"
            onClick={handleOpenModal}
            width="24"
            height="24"
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Section */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDateRangeChecked}
              onChange={(e) => setIsDateRangeChecked(e.target.checked)}
              className="mr-2 accent-blue-500"
            />
            Search by date range
          </label>
          {isDateRangeChecked && (
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expense Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Total</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id} className="bg-accent">
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.expenseName}</TableCell>
                <TableCell>{expense.quantity}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(expense.price)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(expense.total)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {expense.isMaintenance ? "Maintenance" : "Non-Maintenance"}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleSoftDelete(expense.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal for Adding Expense */}
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddExpense={handleAddExpense}
        />

        {/* Modal for Editing Expense */}
        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          expense={currentExpense}
          onUpdateExpense={handleUpdateExpense}
        />
      </CardContent>
    </Card>
  );
}
