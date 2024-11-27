"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/app/(ui)/admin/components/ui/badge";
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

// Definisikan tipe untuk payment
interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  status: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]); // State untuk data pembayaran
  const [showOptions, setShowOptions] = useState<number | null>(null);

  // Memperbarui showOptions untuk menampilkan/menyembunyikan menu aksi
  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  // Ambil data pembayaran dari API menggunakan fetch
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Ambil token dari localStorage
        const response = await fetch("api/payments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "AccessToken": token || "", // Menambahkan token ke dalam header
          },
        });

        if (!response.ok) throw new Error("Error fetching payments data");

        const data = await response.json();
        setPayments(data); // Set data pembayaran ke state
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments(); // Memanggil fetchPayments saat komponen dimuat
  }, []);

  // Fungsi untuk menghapus pembayaran
  const deletePayment = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`api/payments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "AccessToken": token || "", // Menambahkan token ke dalam header
        },
      });

      if (!response.ok) throw new Error("Error deleting payment");

      setPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== id));
      alert("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  // Fungsi untuk mengedit pembayaran (misalnya mengubah status)
  const editPayment = (id: number) => {
    alert(`Edit payment with ID: ${id}`);
    // Bisa ditambahkan logika untuk mengedit status atau transaksi
  };

  return (
    <Card>
      <CardHeader className="px-7 relative">
        <CardTitle>Payments</CardTitle>
        <CardDescription>List of payments made by customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="bg-accent">
                <TableCell>{payment.bookingId}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(payment.amount)}
                </TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>{payment.transactionId || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${
                      payment.status === "Completed"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                    variant={payment.status === "Completed" ? "secondary" : "outline"}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right relative flex justify-center items-center">
                  <Icon
                    icon="mdi:dots-vertical"
                    className="cursor-pointer"
                    onClick={() => toggleOptions(payment.id)}
                  />
                  {showOptions === payment.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => editPayment(payment.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => deletePayment(payment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
