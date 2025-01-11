import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Income {
  totalPendapatan: string;
}

interface Expense {
  total: number;
}

export default function Dashboard() {
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState({
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [0, 0], // Default values for income and expense
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });

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
        generateChartData(data, expenses);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expense", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error fetching expenses data");

        const data: Expense[] = await response.json();
        setExpenses(data);
        generateChartData(incomeData, data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchIncome();
    fetchExpenses();
  }, [incomeData]);

  const generateChartData = (income: Income[], expense: Expense[]) => {
    const totalIncome = income.reduce((sum, item) => {
      return sum + parseInt(item.totalPendapatan.replace(/[^0-9]/g, ""));
    }, 0);

    const totalExpense = expense.reduce((sum, item) => {
      return sum + item.total;
    }, 0);

    setChartData({
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [totalIncome, totalExpense],
          backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-center text-lg font-semibold mb-2">
          Income vs Expense (Bar Chart)
        </h3>
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Income and Expense Comparison" },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500">Loading chart...</p>
        )}
      </div>
    </div>
  );
}
