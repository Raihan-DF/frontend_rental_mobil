import React, { useState, useEffect } from "react";

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
    status: "CANCELED";
  };
}

function BookingCanceled() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/cancel");
        const data = await response.json();

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
                  src={`/api/file?filename=${booking.vehicle.images[0].imageUrl}`} // Mengambil gambar pertama
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
                          : "text-red-600"
                      }`}
                    >
                      <strong>Status:</strong> {booking.payment.status}
                    </dd>
                  </div>
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
    </div>
  );
}

export { BookingCanceled };
