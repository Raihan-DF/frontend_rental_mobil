import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface PaymentDetails {
  id: number;
  amount: number;
  status: string;
}

interface VerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number;
  onVerify: (status: "Success Refund" | "Invalid") => void;
}

const VerifyPaymentModal: React.FC<VerifyPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentId,
  onVerify,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Harap login ulang.");
      }

      const response = await axios.get(`/api/payments/${paymentId}`, {
        headers: {
          "Content-Type": "application/json",
          AccessToken: token || "",
        },
      });

      setPaymentDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPaymentDetails();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paymentDetails ? (
          <div className="p-4 space-y-4">
            <div className="bg-yellow-100 p-3 rounded">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Permintaan Refund
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Silakan tinjau detail pembayaran berikut sebelum memberikan
              keputusan.
            </p>
            <div className="space-y-2">
              <p>
                <span className="font-medium">ID Pembayaran:</span> {" "}
                {paymentDetails.id}
              </p>
              <p>
                <span className="font-medium">Jumlah:</span> {" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(paymentDetails.amount)}
              </p>
              <p>
                <span className="font-medium">Status Saat Ini:</span> {" "}
                <span className="text-yellow-600 font-semibold">
                  {paymentDetails.status}
                </span>
              </p>
            </div>
            <div className="mt-4 p-4 bg-yellow-100 rounded">
              <p className="text-sm text-gray-800 font-semibold">
                Konfirmasi refund akan diproses sesuai keputusan Anda.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Data pembayaran tidak tersedia.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onVerify("Success Refund")}
          style={{ backgroundColor: "#4CAF50", color: "white" }}
          variant="contained"
        >
          Setujui
        </Button>
        <Button
          onClick={() => onVerify("Invalid")}
          style={{ backgroundColor: "#f44336", color: "white" }}
          variant="contained"
        >
          Tolak
        </Button>
        <Button onClick={onClose} >
          Batal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyPaymentModal;
