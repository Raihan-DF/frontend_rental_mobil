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
// import AddMaintenanceModal from "../../../../components/modal/maintenance/addMaintenance/page";
// import EditMaintenanceModal from "@/app/components/modal/maintenance/editMaintenance/page";

// Definisikan tipe untuk maintenance
interface Maintenance {
  id: number;
  vehicleId: number;
  date: string;
  mechanicName: string;
  details:string;
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
      const response = await fetch(`/api/maintenance/${id}`, {
        method: "DELETE",
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
                <TableCell className="text-right">
                  {maintenance.vehicle?.name || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {maintenance.vehicle?.licensePlate || "N/A"}
                </TableCell>
                <TableCell className="text">
                  {maintenance.details}
                </TableCell>
                <TableCell className="text">
                  {maintenance.status}
                </TableCell>
                <TableCell className="text-right relative flex justify-center items-center">
                  <Icon
                    icon="mdi:dots-vertical"
                    className="cursor-pointer"
                    onClick={() => toggleOptions(maintenance.id)}
                  />
                  {showOptions === maintenance.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => {
                          setMaintenanceToEdit(maintenance);
                          setIsModalEditOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => deleteMaintenance(maintenance.id)}
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
      {/* Add Maintenance Modal */}
      {/* <AddMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMaintenance={handleAddMaintenance}
      /> */}
      {/* Edit Maintenance Modal */}
      {/* <EditMaintenanceModal
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onUpdateMaintenance={handleEditMaintenance}
        maintenance={maintenanceToEdit}
      /> */}
    </Card>
  );
}
