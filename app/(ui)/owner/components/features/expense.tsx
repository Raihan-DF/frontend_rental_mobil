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

interface Expense {
  id: number;
  expenseName: string;
  quantity: number;
  date: string; // Format: YYYY-MM-DD
  price: number;
  total: number;
  isMaintenance: boolean;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

export default function Expenses() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("/api/expense", {
          headers: {
            "Content-Type": "application/json",
            AccessToken: accessToken || "",
          },
        });

        if (!response.ok) throw new Error("Error fetching expenses data");

        const data: Expense[] = await response.json();
        setExpenses(data);
        setFilteredExpenses(data);
        generateChartData(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const generateChartData = (data: Expense[]) => {
    const categories = ["Maintenance", "Operational"];
    const groupedData = categories.map((category) =>
      data.filter((item) =>
        category === "Maintenance" ? item.isMaintenance : !item.isMaintenance
      )
    );

    const chartDataset = groupedData.map((group, index) => ({
      label: categories[index],
      data: group.map((expense) => expense.total),
      backgroundColor:
        index === 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)",
      borderColor:
        index === 0 ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    }));

    const labels = data.map((expense) =>
      new Date(expense.date).toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      })
    );

    setChartData({
      labels,
      datasets: chartDataset,
    });
  };

  const handleMonthFilter = (month: string) => {
    setSelectedMonth(month);
    if (!month) {
      setFilteredExpenses(expenses);
      generateChartData(expenses);
      return;
    }

    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const selectedMonthDate = new Date(month + "-01");
      return (
        expenseDate.getFullYear() === selectedMonthDate.getFullYear() &&
        expenseDate.getMonth() === selectedMonthDate.getMonth()
      );
    });
    setFilteredExpenses(filtered);
    generateChartData(filtered);
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
    pdf.text("Expenses Report", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Generated on: " + new Date().toLocaleDateString(), 10, 20);

    pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
    pdf.save("expenses-report.pdf");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>
          Overview of expenses with filters and chart.
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
          <h2 className="text-center text-xl font-bold mb-4">
            Expenses Report
          </h2>
          <Table className="border-collapse border border-gray-300 w-full">
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="border border-gray-300">Date</TableHead>
                <TableHead className="border border-gray-300">
                  Expense Name
                </TableHead>
                <TableHead className="border border-gray-300">
                  Quantity
                </TableHead>
                <TableHead className="border border-gray-300">Price</TableHead>
                <TableHead className="border border-gray-300">Total</TableHead>
                <TableHead className="border border-gray-300">
                  Category
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="border border-gray-300">
                      {expense.date}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {expense.expenseName}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {expense.quantity}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(expense.price)}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(expense.total)}
                    </TableCell>
                    <TableCell className="border border-gray-300">
                      {expense.isMaintenance ? "Maintenance" : "Operational"}
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
              Expenses by Category (Bar Chart)
            </h3>
            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Expenses Overview" },
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
              Expense Distribution (Doughnut Chart)
            </h3>
            {chartData ? (
              <Doughnut
                data={{
                  labels: ["Maintenance", "Operational"],
                  datasets: [
                    {
                      label: "Expense Distribution",
                      data: [
                        filteredExpenses
                          .filter((exp) => exp.isMaintenance)
                          .reduce((acc, curr) => acc + curr.total, 0),
                        filteredExpenses
                          .filter((exp) => !exp.isMaintenance)
                          .reduce((acc, curr) => acc + curr.total, 0),
                      ],
                      backgroundColor: ["#4bc0c0", "#ff6384"],
                      hoverOffset: 4,
                    },
                  ],
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
