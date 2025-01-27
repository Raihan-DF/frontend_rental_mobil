import React, { useState, useEffect } from "react";
import { string } from "zod";

interface Booking {
  id: number;
  vehicle: {
    name: string;
    images: { imageUrl: string }[]; // Pastikan gambar adalah array objek dengan atribut imageUrl
  };
  pickupLocation: string;
  pickupDateTime: string;
  duration: number;
  payment: {
    status: "CANCELED"|"Pending request refund";
  };
}

function BookingCanceled() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [refundDestination, setRefundDestination] = useState("");
  const [refundDestinationType, setRefundDestinationType] = useState("Transfer");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  const handleCancelClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const handleRequestRefund = async () => {
    if (selectedBookingId === null) return;


    const data = {
      refundDestination:refundDestination,
      refundDestinationType:refundDestinationType,
    };

    try {
      console.log(data);
      const response = await fetch(
        `/api/payments/refund/${selectedBookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            AccessToken: localStorage.getItem("access_token") || "",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to request Refund");
      }

      setBookings(
        bookings.filter((booking) => booking.id !== selectedBookingId)
      );
      setShowModal(false);
    } catch (error) {
      console.log("Error request refund:", error);
      alert("Failed to request refund. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/cancel");
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="block rounded-lg p-4 shadow-sm shadow-indigo-100 bg-white"
            >
              {/* Menampilkan gambar kendaraan dengan pengecekan lebih aman */}
              {booking.vehicle.images && booking.vehicle.images.length > 0 ? (
                <img
                  alt={booking.vehicle.name}
                  src={`/api/file?filename=${booking.vehicle.images[0]}`} // Mengambil gambar pertama
                  className="h-56 w-full rounded-md object-cover"
                />
              ) : (
                <div className="h-56 w-full bg-gray-300 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}

              <div className="mt-4">
                <dl>
                  <div>
                    <dd className="font-medium text-lg text-blue-600">
                      {booking.vehicle.name}
                    </dd>
                  </div>

                  <div className="mt-2">
                    <dt className="sr-only">Pickup Location</dt>
                    <dd className="text-sm text-gray-500">
                      <strong>Pickup Location:</strong> {booking.pickupLocation}
                    </dd>
                  </div>

                  <div className="mt-2">
                    <dt className="sr-only">Pickup Date</dt>
                    <dd className="text-sm text-gray-500">
                      <strong>Pickup Date:</strong>{" "}
                      {new Date(booking.pickupDateTime).toLocaleString()}
                    </dd>
                  </div>

                  <div className="mt-2">
                    <dt className="sr-only">Duration</dt>
                    <dd className="text-sm text-gray-500">
                      <strong>Duration:</strong> {booking.duration} days
                    </dd>
                  </div>

                  <div className="mt-2">
                    <dt className="sr-only">Status</dt>
                    <dd
                      className={`text-sm font-semibold ${
                        booking.payment.status === "CANCELED"
                          ? "text-red-600"
                          : booking.payment.status === "Pending request refund"
                          ? "text-yellow-600"
                          : ""
                      }`}
                    >
                      <strong>Status:</strong> {booking.payment.status}
                    </dd>
                  </div>

                  {booking.payment.status === "CANCELED" && (
                    <button
                      className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      onClick={() => handleCancelClick(booking.id)}
                    >
                      Request Refund
                    </button>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No completed bookings found.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
            <p className="mb-4">
              Are you sure you want to cancel this booking? Please note that any
              deposit paid will be forfeited.
            </p>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Request Refund</h3>
            <p className="mb-4 text-sm text-gray-700">
              Please provide your refund details below. Note that only{" "}
              <strong>80%</strong> of the booking payment will be refunded.
            </p>

            {/* Dropdown for Refund Destination Type */}
            <div className="mb-4">
              <label
                htmlFor="refundDestinationType"
                className="block text-sm font-medium text-gray-700"
              >
                Refund Destination Type
              </label>
              <select
                value={refundDestinationType}
                onChange={(e) => setRefundDestinationType(e.target.value)}
                id="refundDestinationType"
                name="refundDestinationType"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Transfer">Bank Transfer</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>

            {/* Input for Refund Destination */}
            <div className="mb-4">
              <label
                htmlFor="refundDestination"
                className="block text-sm font-medium text-gray-700"
              >
                Refund Destination
              </label>
              <input
                type="text"
                value={refundDestination}
                onChange={(e) => setRefundDestination(e.target.value)}
                id="refundDestination"
                name="refundDestination"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter account number or e-wallet ID"
              />
            </div>

            {/* Amount Refund Notification */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Refund Amount
              </label>
              <p className="text-gray-600 text-sm">
                You will receive <strong>80%</strong> of your booking payment.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-700 py-1 px-4 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                onClick={handleRequestRefund}
              >
                Submit Refund Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { BookingCanceled };
