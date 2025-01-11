"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(ui)/admin/components/ui/card";

interface Payment {
  id: number;
  status: string;
}

interface Maintenance {
  id: number;
  status: string;
}

interface Vehicle {
  id: number;
  typeId: number;
}

interface VehicleType {
  id: number;
  name: string;
}

interface Booking {
  id: number;
  withDriver: boolean;
}

export default function PaymentRefundDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalRefunds, setTotalRefunds] = useState<number>(0);

  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [completedMaintenance, setCompletedMaintenance] = useState<number>(0);
  const [inMaintenance, setInMaintenance] = useState<number>(0);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicleCountByType, setVehicleCountByType] = useState<
    Record<string, number>
  >({});
  const [totalVehicles, setTotalVehicles] = useState<number>(0);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalBookingsWithDriver, setTotalBookingsWithDriver] =
    useState<number>(0);
  const [totalBookingsWithoutDriver, setTotalBookingsWithoutDriver] =
    useState<number>(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/payments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            AccessToken: token || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching payments data");

        const data: Payment[] = await response.json();

        const paymentsCount = data.filter(
          (payment) => payment.status !== "Pending request refund"
        ).length;

        const refundsCount = data.filter(
          (payment) =>
            payment.status === "Pending request refund" ||
            payment.status === "Success Refund"
        ).length;

        setPayments(data);
        setTotalPayments(paymentsCount);
        setTotalRefunds(refundsCount);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    const fetchMaintenance = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/maintenance", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            AccessToken: token || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching maintenance data");

        const data: Maintenance[] = await response.json();

        const completedCount = data.filter(
          (item) => item.status === "completed"
        ).length;

        const inMaintenanceCount = data.filter(
          (item) => item.status === "in_progress"
        ).length;

        setMaintenance(data);
        setCompletedMaintenance(completedCount);
        setInMaintenance(inMaintenanceCount);
      } catch (error) {
        console.error("Error fetching maintenance:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Error fetching vehicle data");
        const data: Vehicle[] = await response.json();
        setVehicles(data);
        setTotalVehicles(data.length);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("/api/vehicles/types");
        if (!response.ok) throw new Error("Failed to fetch vehicle types");
        const data: VehicleType[] = await response.json();
        setVehicleTypes(data);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

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

        const data: Booking[] = await response.json();
        setBookings(data);

        // Hitung jumlah booking dengan driver dan tanpa driver
        const withDriver = data.filter((booking) => booking.withDriver).length;
        const withoutDriver = data.length - withDriver;

        setTotalBookingsWithDriver(withDriver);
        setTotalBookingsWithoutDriver(withoutDriver);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchPayments();
    fetchMaintenance();
    fetchVehicles();
    fetchVehicleTypes();
    fetchBookings();
  }, []);

  useEffect(() => {
    const countByType: Record<string, number> = {};
    vehicleTypes.forEach((type) => {
      const count = vehicles.filter((v) => v.typeId === type.id).length;
      countByType[type.name] = count;
    });
    setVehicleCountByType(countByType);
  }, [vehicles, vehicleTypes]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card for Vehicle Summary (Lebih lebar) */}
        <div className="col-span-2">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Vehicle Summary</CardTitle>
              <CardDescription className="text-white">
                Jumlah total kendaraan dan jenis-jenis kendaraan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-extrabold">{totalVehicles}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(vehicleCountByType).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <p className="text-lg font-semibold">{type}</p>
                    <p className="text-3xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card for Total Bookings (With and Without Driver) */}
        <Card className="bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Bookings</CardTitle>
            <CardDescription className="text-white">
              Jumlah total booking dengan driver dan tanpa driver.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Bookings with Driver */}
              <div className="text-center">
                <p className="text-lg font-semibold">With Driver</p>
                <p className="text-5xl font-extrabold">
                  {totalBookingsWithDriver}
                </p>
              </div>

              {/* Bookings without Driver */}
              <div className="text-center">
                <p className="text-lg font-semibold">Without Driver</p>
                <p className="text-5xl font-extrabold">
                  {totalBookingsWithoutDriver}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card untuk Total Payments */}
        <Card className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Payments</CardTitle>
            <CardDescription className="text-white">
              Jumlah semua pembayaran yang berhasil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold">{totalPayments}</p>
          </CardContent>
        </Card>

        {/* Card untuk Total Refunds */}
        <Card className="bg-gradient-to-r from-red-400 to-red-600 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Total Refunds</CardTitle>
            <CardDescription className="text-white">
              Jumlah permintaan refund yang masih pending.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-extrabold">{totalRefunds}</p>
          </CardContent>
        </Card>

        {/* Card untuk Maintenance Status */}
        <Card className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Maintenance Status</CardTitle>
            <CardDescription className="text-white">
              Ringkasan status maintenance saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-lg font-semibold">Completed</p>
                <p className="text-4xl font-extrabold">
                  {completedMaintenance}
                </p>
              </div>
              <div className="h-16 border-l-2 border-white mx-4"></div>
              <div className="text-center">
                <p className="text-lg font-semibold">In Maintenance</p>
                <p className="text-4xl font-extrabold">{inMaintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
