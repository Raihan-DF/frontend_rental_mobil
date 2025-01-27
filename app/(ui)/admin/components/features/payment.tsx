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
import VerifyPaymentModal from "@/app/modal/paymentConfirmation/paymentConfirmation";

// Definisikan tipe untuk payment
interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  // transactionId?: string;
  status: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]); // State untuk data pembayaran
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null); // Untuk modal konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil data pembayaran dari API menggunakan fetch
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Ambil token dari localStorage
        const response = await fetch("api/payments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            AccessToken: token || "", // Menambahkan token ke dalam header
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

  // Fungsi untuk membuka modal verifikasi
  const openVerifyModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Fungsi untuk menangani verifikasi pembayaran
  const handleVerify = async (status: "In Booking" | "Invalid") => {
    if (!selectedPayment) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `api/payments/verify/${selectedPayment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            AccessToken: token || "",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Error verifying payment");

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === selectedPayment.id ? { ...payment, status } : payment
        )
      );
      alert("Payment status updated successfully");
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedPayment(null);
    }
  };

  return (
    <>
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
                {/* <TableHead>Transaction ID</TableHead> */}
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.bookingId}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(payment.amount)}
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  {/* <TableCell>{payment.transactionId || "N/A"}</TableCell> */}
                  <TableCell className="flex justify-center items-center">
                    <Badge
                      className={`flex justify-center items-center text-xs ${
                        payment.status === "Completed"
                          ? "bg-green-500 text-white"
                          : payment.status === "In Booking"
                          ? "bg-blue-500 text-white"
                          : payment.status === "PENDING"
                          ? "bg-orange-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      variant={
                        payment.status === "Completed" ? "secondary" : "outline"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {payment.status === "PENDING" && (
                      <button
                        className="mr-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => openVerifyModal(payment)}
                      >
                        Confirmation
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Verifikasi */}
      {selectedPayment && (
        <VerifyPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paymentId={selectedPayment.id}
          onVerify={handleVerify}
        />
      )}
    </>
  );
}
