"use client";
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
import { useEffect, useState } from "react";
import AddVehicleModal from "../../../../components/modal/vehicles/addVehicles/page";
import EditVehicleModal from "@/app/components/modal/vehicles/editVehicles/page";

// Definisikan tipe untuk kendaraan
interface Vehicle {
  id: number;
  name: string;
  year: number;
  typeId: number;
  transmission: string;
  status: string;
  licensePlate: string;
  features?: string;
  description?: string;
  harga: number;
  images: string[];
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle>();
  const [vehicleTypes, setVehicleTypes] = useState<{ id: number; name: string }[]>([]);

  // Mengambil data kendaraan dari API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Error fetching vehicles data");
        const data = await response.json();
        console.log(data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [vehicleTypes]);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("/api/vehicles/types");
        if (!response.ok) throw new Error("Failed to fetch vehicle types");

        const data = await response.json();
        setVehicleTypes(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

    fetchVehicleTypes();
  }, [])

  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const handleEditVehicle = (editVehicle: Vehicle) => {
    setVehicles((prev) => {
      return prev.map((vehicle) =>
        vehicle.id === editVehicle.id ? editVehicle : vehicle
      );
    });
  };

  const deleteVehicle = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Kendaraan berhasil dihapus");
        // Update state untuk menghapus kendaraan dari daftar
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== id)
        );
      } else {
        throw new Error("Gagal menghapus kendaraan");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="px-7 relative">
        <CardTitle>Vehicles</CardTitle>
        <CardDescription>List of vehicles available for rent.</CardDescription>
        <div className="absolute top-4 right-4">
          <Icon
            icon="mdi:plus"
            className="cursor-pointer text-green-500 hover:text-green-600"
            onClick={() => setIsModalOpen(true)}
            width="24"
            height="24"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Vehicle Name</TableHead>
              <TableHead className="hidden sm:table-cell">Year</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">
                Transmission
              </TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">License Plate</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="bg-accent">
                <TableCell>
                  <img
                    src={`/api/file?filename=${vehicle?.images[0]}`}
                    alt={vehicle.name}
                    className="w-16 h-16 object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{vehicle.name}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {vehicle.year}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {/* {vehicleTypes?.find(types => types.id === vehicle.typeId)?.name} */}
                  {vehicle.typeId}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {vehicle.transmission}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    className={`text-xs ${
                      vehicle.status === "ready"
                        ? "bg-green-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                    variant={
                      vehicle.status === "ready" ? "secondary" : "outline"
                    }
                  >
                    {vehicle.status === "ready" ? "Ready" : "Booked"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {vehicle.licensePlate}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(vehicle.harga)}
                </TableCell>
                <TableCell className="text-right relative flex justify-center items-center">
                  <Icon
                    icon="mdi:dots-vertical"
                    className="cursor-pointer"
                    onClick={() => toggleOptions(vehicle.id)}
                  />
                  {showOptions === vehicle.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => {
                          setVehicleToEdit(vehicle);
                          setIsModalEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => deleteVehicle(vehicle.id)}
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
      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onUpdateVehicle={handleEditVehicle}
        vehicle={vehicleToEdit} onAddVehicle={function (vehicle: any): void {
          throw new Error("Function not implemented.");
        } }      />
    </Card>
  );
}
