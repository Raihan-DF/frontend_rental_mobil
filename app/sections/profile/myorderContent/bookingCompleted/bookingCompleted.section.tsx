import React, { useState, useEffect } from "react";

interface Booking {
  id: number;
  vehicle: {
    name: string;
    images: string[]; // Pastikan gambar adalah array objek dengan atribut imageUrl
  };
  pickupLocation: string;
  pickupDateTime: string;
  duration: number;
  payment: {
    status: "Completed";
  };
}

function BookingCompleted() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(2); // Ubah sesuai kebutuhan
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/completed");
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

  // Fungsi untuk mengubah halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Menghitung index booking yang ditampilkan
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <div className="p-4">
      {currentBookings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentBookings.map((booking) => (
              <div
                key={booking.id}
                className="block rounded-lg p-4 shadow-lg bg-white transition-transform transform hover:scale-105"
              >
                {/* Menampilkan gambar kendaraan dengan pengecekan lebih aman */}
                {booking.vehicle.images && booking.vehicle.images.length > 0 ? (
                  <img
                    alt={booking.vehicle.name}
                    src={`/api/file?filename=${booking.vehicle?.images[0]}`} // Mengambil gambar pertama
                    className="h-48 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-300 rounded-md flex items-center justify-center">
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
                        <strong>Pickup Location:</strong>{" "}
                        {booking.pickupLocation}
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
                          booking.payment.status === "Completed"
                            ? "text-green-600"
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

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <nav>
              <ul className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
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

export { BookingCompleted };