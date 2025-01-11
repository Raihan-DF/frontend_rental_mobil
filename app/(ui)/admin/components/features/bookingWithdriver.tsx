"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

// Definisikan tipe untuk booking
interface Booking {
  id: number;
  userId: number;
  vehicleId: number;
  vehicleName?: string; // Opsional, jika Anda ingin memetakan di frontend
  userName?: string; // Opsional, jika Anda ingin memetakan di frontend
  pickupLocation: string;
  pickupDateTime: string; // Gabungan pickupDate dan pickupTime
  duration: number; // Jika data dalam hitungan jam atau hari
  withDriver: boolean;
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  driverAddress?: string;
  returnLocation?: string;
  descriptionLocation?: string;
  status: string; // Tetap gunakan status
  price: number;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showOptions, setShowOptions] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/bookings", {
          headers: {
            "Content-Type": "application/json",
            AccessToken: token || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching bookings data");
        const data = await response.json();

        // Transformasi data agar sesuai dengan interface Booking
        const transformedData: Booking[] = data.map((booking: any) => ({
          id: booking.id,
          userId: booking.userId,
          vehicleId: booking.vehicleId,
          vehicleName: booking.vehicle?.name || "Unknown",
          userName: booking.user?.name || "Unknown",
          pickupLocation: booking.pickupLocation,
          pickupDateTime: booking.pickupDateTime,
          duration: booking.duration,
          withDriver: booking.withDriver,
          driverId: booking.driverId,
          driverName: booking.driverName,
          driverPhone: booking.driverPhone,
          driverAddress: booking.driverAddress,
          returnLocation: booking.returnLocation,
          descriptionLocation: booking.descriptionLocation,
          status: booking.status,
          price: booking.price,
        }));

        setBookings(transformedData);
      } catch (error) {
        toast.error("Failed to fetch bookings data");
      }
    };
    fetchBookings();
  }, []);

  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const bookingsWithDriver = bookings.filter((booking) => booking.withDriver);
  const bookingsWithoutDriver = bookings.filter(
    (booking) => !booking.withDriver
  );

  return (
    <div>
      {/* Table for bookings without driver */}
      <Card>
        <CardHeader className="px-7 relative">
          <CardTitle>Bookings with Driver</CardTitle>
          <CardDescription>List of bookings with a driver.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                {/* <TableHead>Customer</TableHead> */}
                <TableHead>Pickup Location</TableHead>
                <TableHead>Pickup DateTime</TableHead>
                <TableHead>Duration</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Driver</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {bookingsWithDriver.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.vehicleName}</TableCell>
                {/* <TableCell>{booking.userName}</TableCell> */}
                <TableCell>{booking.pickupLocation}</TableCell>
                <TableCell>
                  {new Date(booking.pickupDateTime).toLocaleString()}
                </TableCell>
                <TableCell>{booking.duration} Day</TableCell>
                {/* <TableCell>
                  <Badge
                    className={`text-xs ${
                      booking.status === "Booked"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {booking.status}
                  </Badge>
                </TableCell> */}
                <TableCell>{booking.driverName || "N/A"}</TableCell>
                <TableCell className="text-center">
                  <Icon
                    icon="mdi:dots-vertical"
                    className="cursor-pointer"
                    onClick={() => toggleOptions(booking.id)}
                  />
                  {/* Menu actions */}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
