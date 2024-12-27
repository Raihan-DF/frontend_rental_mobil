import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import React, { useState, useEffect, useRef } from "react";
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

const Income: React.FC = () => {
  const [incomes, setIncomes] = useState<IncomeData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const tableRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [doughnutChartData, setDoughnutChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

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

  // Filter berdasarkan bulan dan nama pelanggan
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

  useEffect(() => {
    // Menghitung pendapatan berdasarkan tanggal untuk chart Bar
    const dailyIncome = filteredIncomes.reduce((acc, income) => {
      const incomeDate = new Date(income.tanggal);
      const formattedDate = incomeDate.toISOString().split("T")[0]; // Format YYYY-MM-DD untuk tanggal

      const amount = parseFloat(
        income.totalPendapatan.replace("Rp", "").replace(",", "")
      );
      acc[formattedDate] = acc[formattedDate]
        ? acc[formattedDate] + amount
        : amount;
      return acc;
    }, {} as Record<string, number>);

    // Persiapkan data untuk chart Bar (Pendapatan Berdasarkan Tanggal)
    setChartData({
      labels: Object.keys(dailyIncome), // Tanggal sebagai label
      datasets: [
        {
          label: "Pendapatan Berdasarkan Tanggal",
          data: Object.values(dailyIncome), // Pendapatan per tanggal
          backgroundColor: "#36A2EB",
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });

    // Menghitung pendapatan berdasarkan metode pembayaran untuk chart Doughnut
    const paymentMethods = filteredIncomes.reduce((acc, income) => {
      const method = income.metodePembayaran;
      const amount = parseFloat(
        income.totalPendapatan.replace("Rp", "").replace(",", "")
      );
      acc[method] = acc[method] ? acc[method] + amount : amount;
      return acc;
    }, {} as Record<string, number>);

    // Persiapkan data untuk chart Doughnut
    setDoughnutChartData({
      labels: Object.keys(paymentMethods),
      datasets: [
        {
          label: "Pendapatan Berdasarkan Metode Pembayaran",
          data: Object.values(paymentMethods),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Array warna
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });
  }, [filteredIncomes]);

  const handlePrint = () => {
    const printContents = document.getElementById("income-table")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Refresh to restore functionality
    }
  };

  const generatePDF = async () => {
    if (!tableRef.current) return;
  
    // Capture the table as a canvas using html2canvas
    const canvas = await html2canvas(tableRef.current, {
      scale: 2, // Scale for higher resolution
      useCORS: true, // Handle CORS
    });
  
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    // Add a title and timestamp on the PDF
    pdf.setFontSize(18);
    pdf.text("Income Report", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Generated on: " + new Date().toLocaleDateString(), 10, 20);
  
    // Add the table image (captured as PNG)
    pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
  
    // Save the generated PDF
    pdf.save("income-report.pdf");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income</CardTitle>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <label htmlFor="monthFilter" className="font-medium">
              Filter Bulan:
            </label>
            <input
              type="month"
              id="monthFilter"
              className="border rounded px-3 py-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
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
        {/* Tabel */}
        <div ref={tableRef} className="p-4 bg-white">
          <h2 className="text-center text-xl font-bold mb-4">Income Report</h2>
          <Table className="border-collapse border border-gray-300 w-full">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="border border-gray-300">
                  Date
                </TableHead>
                <TableHead className="border border-gray-300">
                  Customer
                </TableHead>
                <TableHead className="border border-gray-300">
                  Vehicles
                </TableHead>
                <TableHead className="border border-gray-300">
                  LicensePlate
                </TableHead>
                <TableHead className="border border-gray-300">
                  Duration
                </TableHead>
                <TableHead className="border border-gray-300">
                  Rental Cost
                </TableHead>
                <TableHead className="border border-gray-300">
                  Payment Method
                </TableHead>
                <TableHead className="border border-gray-300">
                  Payment Status
                </TableHead>
                <TableHead className="border border-gray-300">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchFilteredIncomes.map((income, index) => (
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
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Grid layout untuk charts */}
        <div className="grid gap-6 lg:grid-cols-2 pt-6">
          {/* Bar Chart (Pendapatan Berdasarkan Tanggal) */}
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-center text-lg font-semibold mb-2">
              Pendapatan Berdasarkan Tanggal (Bar Chart)
            </h3>
            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  animation: {
                    duration: 30, // Mengurangi durasi animasi
                    easing: "easeOutBounce",
                  },
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Pendapatan per Tanggal" },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading chart...</p>
            )}
          </div>

          {/* Doughnut Chart (Distribusi Pendapatan Berdasarkan Metode Pembayaran) */}
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-center text-lg font-semibold mb-2">
              Distribusi Pendapatan Berdasarkan Metode Pembayaran (Doughnut
              Chart)
            </h3>
            {doughnutChartData ? (
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  animation: {
                    duration: 30, // Mengurangi durasi animasi
                    easing: "easeOutBounce",
                  },
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Distribusi Pendapatan" },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading chart...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Income;
