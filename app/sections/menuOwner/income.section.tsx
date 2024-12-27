import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
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

interface IncomeData {
  tanggal: string;
  namaPelanggan: string;
  jenisKendaraan: string;
  platNomor: string;
  durasiSewa: string;
  biayaSewa: string;
  metodePembayaran: string;
  statusPembayaran: string;
  totalPendapatan: string;
}

const Income: React.FC = () => {
  const [incomes, setIncomes] = useState<IncomeData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetch("/api/payments/income-report", {
      headers: {
        AccessToken: localStorage.getItem("AccessToken") || "", // Token autentikasi
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIncomes(data);
        } else {
          console.error("Data income tidak valid:", data);
          setIncomes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching income data:", error);
        setIncomes([]);
      });
  }, []);

  const filteredIncomes = incomes.filter((income) => {
    if (!selectedMonth) return true;

    const incomeDate = new Date(income.tanggal);
    const selectedDate = new Date(selectedMonth);

    return (
      incomeDate.getFullYear() === selectedDate.getFullYear() &&
      incomeDate.getMonth() === selectedDate.getMonth()
    );
  });

  const searchFilteredIncomes = filteredIncomes.filter((income) =>
    income.namaPelanggan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Report</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Bulan */}
        <div className="mb-4">
          <input
            type="month"
            className="border p-2 rounded w-full md:w-1/3"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        {/* Filter Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by customer name..."
            className="border p-2 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Income Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Pelanggan</TableHead>
              <TableHead>Jenis Kendaraan</TableHead>
              <TableHead>Plat Nomor</TableHead>
              <TableHead>Durasi Sewa</TableHead>
              <TableHead>Biaya Sewa</TableHead>
              <TableHead>Metode Pembayaran</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Total Pendapatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchFilteredIncomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              searchFilteredIncomes.map((income, index) => (
                <TableRow key={index}>
                  <TableCell>{income.tanggal}</TableCell>
                  <TableCell>{income.namaPelanggan}</TableCell>
                  <TableCell>{income.jenisKendaraan}</TableCell>
                  <TableCell>{income.platNomor}</TableCell>
                  <TableCell>{income.durasiSewa}</TableCell>
                  <TableCell>{income.biayaSewa}</TableCell>
                  <TableCell>{income.metodePembayaran}</TableCell>
                  <TableCell>{income.statusPembayaran}</TableCell>
                  <TableCell>{income.totalPendapatan}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Income;
