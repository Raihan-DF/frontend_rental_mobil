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
import AddMaintenanceModal from "@/app/modal/maintenance/addMaintenance/addMaintenance";
import EditMaintenanceModal from "@/app/modal/maintenance/editMaintenance/editMaintenance";

// Definisikan tipe untuk maintenance
interface Maintenance {
  id: number;
  vehicleId: number;
  date: string;
  mechanicName: string;
  details: string;
  status: string;
  vehicle: {
    id: number;
    name: string;
    licensePlate: string;
    status: string;
  };
}

export default function Maintenance() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [maintenanceToEdit, setMaintenanceToEdit] = useState<Maintenance>();

  // Mengambil data maintenance dari API
  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("/api/maintenance", {
          headers: {
            "Content-Type": "application/json",
            AccessToken: accessToken || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching maintenance data");
        const data = await response.json();
        setMaintenances(data);
      } catch (error) {
        console.error("Error fetching maintenance:", error);
      }
    };

    fetchMaintenances();
  }, []);

  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const handleAddMaintenance = (newMaintenance: Maintenance) => {
    setMaintenances((prev) => [...prev, newMaintenance]);
  };

  const handleEditMaintenance = (editMaintenance: Maintenance) => {
    setMaintenances((prev) => {
      return prev.map((maintenance) =>
        maintenance.id === editMaintenance.id ? editMaintenance : maintenance
      );
    });
  };

  const deleteMaintenance = async (id: number) => {
    try {
      const response = await fetch(`/api/maintenance/${id}/softdelete`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Update state untuk menghapus maintenance dari daftar
        setMaintenances((prevMaintenances) =>
          prevMaintenances.filter((maintenance) => maintenance.id !== id)
        );
      } else {
        throw new Error("Gagal menghapus maintenance");
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="px-7 relative">
        <CardTitle>Maintenance</CardTitle>
        <CardDescription>List of maintenance records.</CardDescription>
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
              <TableHead>Date</TableHead>
              <TableHead>Mechanic</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="">License Plate</TableHead>
              <TableHead className="">Detail</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>{maintenance.date}</TableCell>
                <TableCell>{maintenance.mechanicName}</TableCell>
                <TableCell className="text-left">
                  {maintenance.vehicle?.name || "N/A"}
                </TableCell>
                <TableCell className="text-left">
                  {maintenance.vehicle?.licensePlate || "N/A"}
                </TableCell>
                <TableCell className="text">{maintenance.details}</TableCell>
                <TableCell className="text">{maintenance.status}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                      setMaintenanceToEdit(maintenance);
                      setIsModalEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deleteMaintenance(maintenance.id)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {/* Add Maintenance Modal */}
      <AddMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMaintenance={handleAddMaintenance}
      />
      {/* Edit Maintenance Modal */}
      <EditMaintenanceModal
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        maintenanceId={maintenanceToEdit?.id || 0} // Pass the ID only for fetching data
        onEditMaintenance={handleEditMaintenance}
      />
    </Card>
  );
}
