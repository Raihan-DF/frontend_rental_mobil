"use client";
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
  paymentProof: string;
}

interface VerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number;
  onVerify: (status: "In Booking" | "Invalid") => void;
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
  const [paymentProofSrc, setPaymentProofSrc] = useState<string | null>(null);

  const fetchPaymentDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Harap login ulang.");
      }

      const response = await axios.get(`/api/payments/${paymentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          AccessToken: token || "",
        },
      });

      const result = response.data;
      setPaymentDetails(result);

      // Fetch payment proof image if available
      const res = await fetch(
        `http://localhost:5000/file/get?filename=${result.paymentProof}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const imageBlob = await res.blob();
      const objectURL = URL.createObjectURL(imageBlob);
      setPaymentProofSrc(objectURL);
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : paymentDetails ? (
          <div className="p-4">
            <div className="block">
              <img
                alt="Bukti Pembayaran"
                src={
                  paymentProofSrc ||
                  "https://via.placeholder.com/400x300?text=No+Image+Available"
                }
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />

              <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                ID Pembayaran: {paymentDetails.id}
              </h3>

              <p className="mt-2 max-w-sm text-gray-700">
                <strong>Jumlah:</strong> {paymentDetails.amount}
              </p>

              <p className="mt-2 max-w-sm text-gray-700">
                <strong>Status:</strong> {paymentDetails.status}
              </p>

              {paymentProofSrc ? (
                <p className="mt-2 max-w-sm text-green-600">
                  Bukti pembayaran tersedia.
                </p>
              ) : (
                <p className="mt-2 max-w-sm text-red-500">
                  Bukti pembayaran tidak tersedia.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Data pembayaran tidak tersedia.</p>
        )}
      </DialogContent>
      <DialogActions className="flex justify-between">
        <Button onClick={() => onVerify("In Booking")} color="success">
          Valid
        </Button>
        <Button onClick={() => onVerify("Invalid")} color="error">
          Invalid
        </Button>
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyPaymentModal;
