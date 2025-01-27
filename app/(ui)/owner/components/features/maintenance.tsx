"use client";
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
import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { filter } from "lodash";

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
  const [filteredMaintenances, setFilteredMaintenances] = useState<
    Maintenance[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch data dari API
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
        setFilteredMaintenances(data);
      } catch (error) {
        console.error("Error fetching maintenance:", error);
      }
    };

    fetchMaintenances();
  }, []);

  // Fungsi untuk filter berdasarkan bulan
  const handleMonthFilter = (month: string) => {
    setSelectedMonth(month);
    if (!month) {
      setFilteredMaintenances(maintenances);
      return;
    }

    const filtered = maintenances.filter((maintenance) => {
      const maintenanceDate = new Date(maintenance.date);
      const selectedMonthDate = new Date(month + "-01");
      return (
        maintenanceDate.getFullYear() === selectedMonthDate.getFullYear() &&
        maintenanceDate.getMonth() === selectedMonthDate.getMonth()
      );
    });
    setFilteredMaintenances(filtered);
  };

  const generatePDF = async () => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.setFontSize(18);
    pdf.text("Maintenance Report", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Generated on: " + new Date().toLocaleDateString(), 10, 20);

    pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
    pdf.save("maintenance-report.pdf");
  };

  return (
    <Card>
      <CardHeader className="px-7 relative">
        <CardTitle>Maintenance</CardTitle>
        <CardDescription>List of maintenance records.</CardDescription>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <label htmlFor="monthFilter" className="font-medium">
              Filter by Month:
            </label>
            <input
              type="month"
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => handleMonthFilter(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={tableRef} className="p-4 bg-white">
          <h2 className="text-center text-xl font-bold mb-4">
            Maintenance Report
          </h2>
          <Table className="border-collapse border border-gray-300 w-full">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="border border-gray-300">Date</TableHead>
                <TableHead className="border border-gray-300">
                  Mechanic
                </TableHead>
                <TableHead className="border border-gray-300">
                  Vehicle
                </TableHead>
                <TableHead className="border border-gray-300">
                  License Plate
                </TableHead>
                <TableHead className="border border-gray-300">Detail</TableHead>
                <TableHead className="border border-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell className="border border-gray-300">
                      {new Date(maintenance.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {maintenance.mechanicName}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {maintenance.vehicle?.name || "N/A"}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {maintenance.vehicle?.licensePlate || "N/A"}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {maintenance.details}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {maintenance.status}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
