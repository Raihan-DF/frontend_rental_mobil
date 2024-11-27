// import React, { useState, useEffect } from 'react';

// function BookingModal({ vehicleId, onClose }) {
//   const [vehicle, setVehicle] = useState(null);
//   const [bookingData, setBookingData] = useState({
//     pickupLocation: '',
//     pickupDate: '',
//     pickupTime: '',
//     duration: '',
//   });

//   useEffect(() => {
//     // Fetch data kendaraan berdasarkan ID
//     fetch(`/vehicles/${vehicleId}`, {
//       headers: {
//         'AccessToken': localStorage.getItem('AccessToken'), // Sesuaikan jika token ada di localStorage
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setVehicle(data))
//       .catch((error) => console.error('Error fetching vehicle data:', error));
//   }, [vehicleId]);

//   const handleBooking = () => {
//     // Fetch API untuk buat booking baru
//     fetch('/bookings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'AccessToken': localStorage.getItem('AccessToken'),
//       },
//       body: JSON.stringify({
//         ...bookingData,
//         vehicleId: vehicleId,
//         withDriver: true,  // Sesuaikan dengan pilihan
//       }),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         alert('Booking sukses!');
//         onClose();
//       })
//       .catch((error) => console.error('Error creating booking:', error));
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Detail Booking</h2>
//         {vehicle ? (
//           <>
//             <img src={vehicle.imageUrl} alt={vehicle.name} className="vehicle-image" />
//             <p>Nama Kendaraan: {vehicle.name}</p>
//             <p>Tahun: {vehicle.year}</p>
//             <p>Transmisi: {vehicle.transmission}</p>
//             <p>Harga: {vehicle.harga}</p>

//             <div className="booking-form">
//               <input
//                 type="text"
//                 placeholder="Lokasi Penjemputan"
//                 value={bookingData.pickupLocation}
//                 onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
//               />
//               <input
//                 type="date"
//                 placeholder="Tanggal Penjemputan"
//                 value={bookingData.pickupDate}
//                 onChange={(e) => setBookingData({ ...bookingData, pickupDate: e.target.value })}
//               />
//               <input
//                 type="time"
//                 placeholder="Waktu Penjemputan"
//                 value={bookingData.pickupTime}
//                 onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
//               />
//               <input
//                 type="number"
//                 placeholder="Durasi (jam)"
//                 value={bookingData.duration}
//                 onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
//               />

//               <button onClick={handleBooking}>Confirm Booking</button>
//             </div>
//           </>
//         ) : (
//           <p>Loading vehicle data...</p>
//         )}
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

// export default BookingModal;
