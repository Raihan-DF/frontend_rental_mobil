"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Income {
  tanggal: string; // Format: YYYY-MM-DD
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
    data: number[] | number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
  }[];
}

export default function Income() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [filteredIncome, setFilteredIncome] = useState<Income[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [paymentMethodData, setPaymentMethodData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Payment Methods",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch("/api/payments/income-report", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error fetching income data");

        const data: Income[] = await response.json();
        setIncomeData(data);
        setFilteredIncome(data);
        generateChartData(data);
        generatePaymentMethodChart(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncome();
  }, []);

  const generateChartData = (data: Income[]) => {
    const totalPendapatan = data.map((income) =>
      parseInt(income.totalPendapatan.replace(/[^0-9]/g, ""))
    );

    const labels = data.map((income) => income.tanggal);

    setChartData({
      labels,
      datasets: [
        {
          label: "Total Pendapatan",
          data: totalPendapatan,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const generatePaymentMethodChart = (data: Income[]) => {
    const paymentMethods = data.map((income) => income.metodePembayaran);
    const paymentMethodCount = paymentMethods.reduce(
      (acc: any, method: string) => {
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      },
      {}
    );

    const labels = Object.keys(paymentMethodCount);
    const dataValues = Object.values(paymentMethodCount) as number[];

    // Alternating blue and red colors
    const backgroundColors = labels.map((_, index) =>
      index % 2 === 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)"
    );

    setPaymentMethodData({
      labels,
      datasets: [
        {
          label: "Payment Methods",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleMonthFilter = (month: string) => {
    setSelectedMonth(month);
    if (!month) {
      setFilteredIncome(incomeData);
      generateChartData(incomeData);
      generatePaymentMethodChart(incomeData);
      return;
    }

    const filtered = incomeData.filter((income) => {
      const incomeDate = new Date(income.tanggal);
      const selectedMonthDate = new Date(month + "-01");
      return (
        incomeDate.getFullYear() === selectedMonthDate.getFullYear() &&
        incomeDate.getMonth() === selectedMonthDate.getMonth()
      );
    });
    setFilteredIncome(filtered);
    generateChartData(filtered);
    generatePaymentMethodChart(filtered);
  };

  const generatePDF = async () => {
    if (!tableRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");

    // Tambahkan header ke PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    pdf.setFontSize(18);
    pdf.text("Income Report", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Generated on: " + new Date().toLocaleDateString(), 10, 20);

    // Render tabel ke PDF
    const canvasTable = await html2canvas(tableRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgTable = canvasTable.toDataURL("image/png");
    const tableHeight = (canvasTable.height * pdfWidth) / canvasTable.width;
    pdf.addImage(imgTable, "PNG", 0, 30, pdfWidth, tableHeight);

    // Tambahkan halaman baru untuk Bar Chart
    const barChartCanvas = document.querySelector(
      "#barChart"
    ) as HTMLCanvasElement;
    if (barChartCanvas) {
      const barChartImage = barChartCanvas.toDataURL("image/png");
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Income by Category (Bar Chart)", pdfWidth / 2, 10, {
        align: "center",
      });
      pdf.addImage(
        barChartImage,
        "PNG",
        10,
        20,
        pdfWidth - 20,
        (barChartCanvas.height * (pdfWidth - 20)) / barChartCanvas.width
      );
    }

    // Tambahkan halaman baru untuk Doughnut Chart
    const doughnutChartCanvas = document.querySelector(
      "#doughnutChart"
    ) as HTMLCanvasElement;
    if (doughnutChartCanvas) {
      const doughnutChartImage = doughnutChartCanvas.toDataURL("image/png");
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text("Income Distribution (Doughnut Chart)", pdfWidth / 2, 10, {
        align: "center",
      });
      pdf.addImage(
        doughnutChartImage,
        "PNG",
        30,
        30,
        pdfWidth - 60,
        (doughnutChartCanvas.height * (pdfWidth - 60)) /
          doughnutChartCanvas.width
      );
    }

    // Simpan PDF
    pdf.save("income-report.pdf");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income</CardTitle>
        <CardDescription>
          Overview of income with filters and charts.
        </CardDescription>
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
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Download PDF
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={tableRef} className="p-4 bg-white">
          <h2 className="text-center text-xl font-bold mb-4">Income Report</h2>
          <Table className="border-collapse border border-gray-300 w-full">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="border border-gray-300">Date</TableHead>
                <TableHead className="border border-gray-300">
                  Customer Name
                </TableHead>
                <TableHead className="border border-gray-300">
                  Vehicle Type
                </TableHead>
                <TableHead className="border border-gray-300">
                  License Plate
                </TableHead>
                <TableHead className="border border-gray-300">
                  Rental Duration
                </TableHead>
                <TableHead className="border border-gray-300">
                  Rental Fee
                </TableHead>
                <TableHead className="border border-gray-300">
                  Payment Method
                </TableHead>
                <TableHead className="border border-gray-300">
                  Payment Status
                </TableHead>
                <TableHead className="border border-gray-300">
                  Total Income
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncome.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncome.map((income, index) => (
                  <TableRow key={index}>
                    <TableCell className="border border-gray-300">
                      {income.tanggal}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.namaPelanggan}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.jenisKendaraan}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.platNomor}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.durasiSewa}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.biayaSewa}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.metodePembayaran}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.statusPembayaran}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {income.totalPendapatan}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 pt-6">
          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-center text-lg font-semibold mb-2">
              Total Income (Bar Chart)
            </h3>
            {chartData ? (
              <Bar
                id="barChart"
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Income Overview" },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading chart...</p>
            )}
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-center text-lg font-semibold mb-2">
              Payment Methods (Doughnut Chart)
            </h3>
            {paymentMethodData ? (
              <Doughnut
                id="doughnutChart"
                data={paymentMethodData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Payment Methods" },
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
}
